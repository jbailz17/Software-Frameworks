import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import {GroupModel} from '../models/group.model';
import {DataModel} from '../models/data.model';
import {UserModel, UserIDModel} from '../models/user.model';
import {ChannelModel} from '../models/channel.model';

import {DataService} from '../services/data-service/data.service';

import { AddGroupComponent } from './add-group/add-group.component';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { ChannelUsersComponent } from './channel-users/channel-users.component';
import { GroupUsersComponent } from './group-users/group-users.component';
import { DeleteWarningComponent } from './delete-warning/delete-warning.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  panelOpened: boolean = false;
  editPic: boolean = false;

  user: UserModel;

  isSuper: boolean = false;
  isGroupAdmin: boolean = false;

  data: DataModel;
  groups: GroupModel[] = [];
  normalUsers: UserModel[] = [];
  adminUsers: UserModel[] = [];

  selectedFile = null;

  addGroupRef: MatDialogRef<AddGroupComponent>;
  addChannelRef: MatDialogRef<AddChannelComponent>;
  channelUsersRef: MatDialogRef<ChannelUsersComponent>;
  groupUsersRef: MatDialogRef<GroupUsersComponent>;
  deleteWarningRef: MatDialogRef<DeleteWarningComponent>;

  constructor(private router: Router,
    private dataService: DataService,
    private dialog: MatDialog) { }

  ngOnInit() {

    // If not logged in navigate to login page.
    if(!sessionStorage.getItem('username')) {
      console.log('Invalid user!');
      sessionStorage.clear();
      alert("Invalid User");
      this.router.navigate(['/login']);
      return;
    }

   this.setUserInfo();
   this.setGroups();
   
   if(this.user.access != 'user') {
     this.setUsers();
   }
  }

  // Set current user info.
  setUserInfo() {

    this.user = new UserModel();

    this.user.username = sessionStorage.getItem('username');
    this.user.email = sessionStorage.getItem('email');
    this.user.access = sessionStorage.getItem('access');
    this.user._id = sessionStorage.getItem('_id');
    this.user.imagePath = sessionStorage.getItem('imagePath');

    console.log('USER: ', this.user);

    if(this.user.access == 'super-admin') {
      this.isSuper = true;
    }
    if(this.user.access == 'group-admin') {
      this.isGroupAdmin = true;
    }
  }

  // Set all other users info. Only if current user is admin.
  setUsers() {
    this.dataService.getUsersInfo(this.user._id).then((res) => {
      res.json().map((user) => {
        if( user.access == 'user') {
          this.normalUsers.push(user);
        } else {
          this.adminUsers.push(user);
        }
      });
      console.log('ADMIN USERS: ', this.adminUsers);
      console.log('NORMAL USERS: ', this.normalUsers);
    });
  }

  // Retrieve all the groups that current user has access to.
  setGroups() {
    this.groups = [];
    
    this.dataService.getUserGroups(this.user._id).then((res) => {
      this.groups = res.json();
      console.log('GROUPS: ', this.groups);
    });
  }

  // Create a user list to send to api.
  createUserList(users) {
    let userList = []

    const currentUserID = new UserIDModel();
    currentUserID._id = this.user._id;
    userList.push(currentUserID);

    for (let user of users) {
      const userID = new UserIDModel();
      userID._id = user._id;
      userList.push(userID);
    }

    return userList;
  }

  // Open the add group dialog
  openAddGroup() {
    this.addGroupRef = this.dialog.open(AddGroupComponent, {
      disableClose: false,
      data: {
        users: this.normalUsers
      }
    });

    this.addGroupRef.afterClosed().subscribe((result) => {
      console.log('RESULT: ', result);
      if (result) {
        console.log('ADD GROUP RESULT: ', result);
        this.addGroup(result);
      }
    });

    this.addGroupRef = null;
  }

  // Add a new group and store the data in the mongo database.
  addGroup(details) {
    console.log('ADD GROUP: ', details);

    for(let user of this.adminUsers) {
      details.addedUsers.push(user);
    }

    let newGroup = new GroupModel();
    newGroup.name = details.groupName;
    newGroup.users = this.createUserList(details.addedUsers);

    console.log('NEW GROUP: ', newGroup);
    this.dataService.addGroup(newGroup).then((res) => {
      if(res) {
        this.setGroups();
      }
    });
  }

  // Open add channel dialog box
  openAddChannel(selectedGroup) {
    let groupUsers: UserModel[] = [];

    for(let normalUser of this.normalUsers) {
      for (let user of selectedGroup.users) {
        if(user._id == normalUser._id) {
          groupUsers.push(normalUser);
        }
      }
    }

    console.log('GROUP USERS: ', groupUsers);

    this.addChannelRef = this.dialog.open(AddChannelComponent, {
      disableClose: false,
      data: {
        users: groupUsers
      }
    });

    this.addChannelRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log('ADD CHANNEL RESULT: ', result);
        this.addChannel(result, selectedGroup);
      }
    })

    this.addChannelRef = null;
  }

  // Add a new channel to the selected group and sotre data in the mongo databse.
  addChannel(details, selectedGroup) {

    for(let user of this.adminUsers) {
      details.addedUsers.push(user);
    }

    let newChannel = new ChannelModel;
    newChannel.name = details.channelName;
    newChannel.users = this.createUserList(details.addedUsers);

    this.dataService.addChannel(selectedGroup._id, newChannel).then((res) => {
      if(res) {
        this.setGroups();
      }
    });
  }

  // Open the channel users dialog.
  openChannelUsers(selectedChannel, selectedGroup) {

    let channelUsers: UserModel[] = [];
    let groupUsers: UserModel[] = [];
    let selectedUsers: UserModel[] = [];

    for(let groupUser of selectedGroup.users) {
      for(let user of this.normalUsers) {
        if(user._id == groupUser._id) {
          groupUsers.push(user);
        }
      }
    }

    for (let channelUser of selectedChannel.users) {
      for (let groupUser of groupUsers) {
        if(channelUser._id == groupUser._id) {
          channelUsers.push(groupUser);
        }
      }
    }

    console.log('Group Users: ', groupUsers);
    console.log('Channel Users: ', channelUsers);

    this.channelUsersRef = this.dialog.open(ChannelUsersComponent, {
      disableClose: false,
      data: {
        channelUsers: channelUsers,
        groupUsers: groupUsers,
        channelName: selectedChannel.name
      }
    });

    this.channelUsersRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log('CHANNEL USER RESULT: ', result);
        selectedUsers = result.selectedUsers;
        this.updateChannelUsers(selectedGroup._id, selectedChannel.name, selectedUsers);
      }
    });

    this.channelUsersRef = null;
  }

  // Update channel users based from result from dialog.
  // Store data to the mongo database.
  updateChannelUsers(selectedGroup, selectedChannel, users) {

    let selectedUsers: UserIDModel[] = [];

    for(let user of this.adminUsers) {
      users.push(user);
    }

    selectedUsers = this.createUserList(users);

    this.dataService.updateChannelUsers(selectedGroup, selectedChannel, selectedUsers).then((res) => {
      if(res) {
        this.setGroups();
      }
    });
  }

  // Open group users dialog box.
  openGroupUsers(selectedGroup) {

    let groupUsers: UserModel[] = [];
    let selectedUsers: UserModel[] = [];

    for(let groupUser of selectedGroup.users) {
      for(let user of this.normalUsers) {
        if(user._id == groupUser._id) {
          groupUsers.push(user);
        }
      }
    }

    console.log('USERS: ', this.normalUsers);
    console.log('GROUP USERS: ', groupUsers);

    this.groupUsersRef = this.dialog.open(GroupUsersComponent, {
      disableClose: false,
      data: {
        users: this.normalUsers,
        groupUsers: groupUsers,
        groupName: selectedGroup.name
      }
    });

    this.groupUsersRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log('CHANNEL USER RESULT: ', result);
        selectedUsers = result.selectedUsers;
        this.updateGroupUsers(selectedGroup._id, selectedUsers);
      }
    });

    this.groupUsersRef = null;
  }

  // Update group users based on the result of group user dialog
  updateGroupUsers(selectedGroup, users) {
    let selectedUsers: UserIDModel[] = [];

    for(let user of this.adminUsers) {
      users.push(user);
    }

    selectedUsers = this.createUserList(users);

    this.dataService.updateGroupUsers(selectedGroup, selectedUsers).then((res) => {
      if(res) {
        this.setGroups();
      }
    });
  }

  // Delete the selected group.
  deleteGroup(selectedGroup) {
    this.deleteWarningRef = this.dialog.open(DeleteWarningComponent, {
      disableClose: false,
      data: {
        item: selectedGroup.name
      }
    });

    this.deleteWarningRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log('SELECTED GROUP: ', selectedGroup._id);
        this.dataService.removeGroup(selectedGroup._id).then((res) => {
          if(res) {
            this.setGroups();
          }
        });
      }
    });

    this.deleteWarningRef = null;
  }

  // Delete the selected channel
  deleteChannel(selectedGroup, selectedChannel) {
    this.deleteWarningRef = this.dialog.open(DeleteWarningComponent, {
      disableClose: false,
      data: {
        item: selectedChannel.name
      }
    });

    this.deleteWarningRef.afterClosed().subscribe((result) => {
      if(result) {
        this.dataService.removeChannel(selectedGroup._id, selectedChannel.name).then((res) => {
          if(res) {
            this.setGroups();
          }
        });
      }
    });

    this.deleteWarningRef = null;
  }

  // Close user table
  handleClose(event) {
    if(event) {
      this.setGroups();
      this.panelOpened = !this.panelOpened;
    }
  }

  // Store the image file that was selected.
  fileSelected($event) {
    console.log(event);
    let target: any = event.target;
    this.selectedFile = target.files[0];
    console.log(this.selectedFile);
  }

  // Upload image file that was selected.
  upload() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.dataService.profileImageUpload(fd, this.user._id).then((res) => {
      if (res) {
        console.log('IMAGE RESULT: ', res.json());
        this.user.imagePath = res.json().data.filename;
        sessionStorage.setItem('imagePath', res.json().data.filename);
        this.editPic = !this.editPic;
      }
    })

  }

}
