import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import {GroupModel} from '../models/group.model';
import {DataModel} from '../models/data.model';
import {UserModel} from '../models/user.model';
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

  username: string;
  email: string;
  access: string;

  isSuper: boolean = false;
  isGroupAdmin: boolean = false;

  data: DataModel;
  groups: GroupModel[] = [];
  normalUsers: UserModel[] = [];
  adminUsers: UserModel[] = [];

  addGroupRef: MatDialogRef<AddGroupComponent>;
  addChannelRef: MatDialogRef<AddChannelComponent>;
  channelUsersRef: MatDialogRef<ChannelUsersComponent>;
  groupUsersRef: MatDialogRef<GroupUsersComponent>;
  deleteWarningRef: MatDialogRef<DeleteWarningComponent>;

  constructor(private router: Router,
    private dataService: DataService,
    private dialog: MatDialog) { }

  ngOnInit() {

    if(!sessionStorage.getItem('username')) {
      console.log('Invalid user!');
      sessionStorage.clear();
      alert("Invalid User");
      this.router.navigate(['/login']);
      return;
    }

    console.log('PRE DATA: ', this.data);
    this.username = sessionStorage.getItem('username');
    this.dataService.getData().then((res) => {
      this.data = res.json();
      for(let user of this.data.users) {
        if (this.username == user.username) {
          this.email = user.email;
          this.access = user.access;
          if(user.access == 'group-admin') {
            this.isGroupAdmin = true;
          }
          if(user.access == 'super-admin') {
            this.isSuper = true;
          }
        }
        if (user.access == 'user') {
          this.normalUsers.push(user);
        } else {
          this.adminUsers.push(user);
        }
      }
      this.getGroups(this.data);
      console.log("DATA: ", this.data);
    }).catch((err) => {
      console.log('Unable to retrieve data: ', err);
    });
  }

  // Retrieve all the groups from JSON data
  getGroups(data) {
    this.groups = [];
    for(let group of data.groups) {
      for(let user of group.users) {
        if(user.username == this.username) {
          group.channels = this.getChannels(group.channels);
          this.groups.push(group);
        }
      }
    }
    console.log("GROUPS: ", this.groups);
  }

  // Get each channel for each specific group
  getChannels(data) {
    console.log('CHANNELS: ', data);
    let channels = [];
    for(let channel of data) {
      for(let user of channel.users) {
        if(user.username == this.username) {
          channels.push(channel);
        }
      }
    }
    return channels;
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

  // Add a new group and store the data in the JSON file
  addGroup(details) {
    console.log('ADD GROUP: ', details);

    for(let user of this.adminUsers) {
      details.addedUsers.push(user);
    }

    let newGroup = new GroupModel();
    newGroup.name = details.groupName;
    newGroup.users = details.addedUsers;

    console.log('NEW GROUP: ', newGroup.serialize());
    this.data.groups.push(newGroup);
    this.getGroups(this.data);
    this.dataService.writeData(this.data);
  }

  // Open add channel dialog box
  openAddChannel(selectedGroup) {
    console.log('GROUP NAME: ', selectedGroup.name);
    let groupUsers: UserModel[] = [];

    for (let user of selectedGroup.users) {
      if(user.access == 'user') {
        groupUsers.push(user);
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

  // Add a new channel to the selected group and sotre data in the JSON file.
  addChannel(details, selectedGroup) {

    for(let user of this.adminUsers) {
      details.addedUsers.push(user);
    }

    let newChannel = new ChannelModel;
    newChannel.name = details.channelName;
    newChannel.users = details.addedUsers;

    for (let group of this.data.groups) {
      if (selectedGroup == group) {
        group.channels.push(newChannel);
      }
    }

    this.dataService.writeData(this.data);
    this.getGroups(this.data);
  }

  // Open the channel users dialog.
  openChannelUsers(selectedChannel, selectedGroup) {

    let channelUsers: UserModel[] = [];
    let groupUsers: UserModel[] = [];
    let selectedUsers: UserModel[] = [];

    for(let user of selectedChannel.users) {
      if(user.access == 'user') {
        channelUsers.push(user);
      }
    }

    for(let user of selectedGroup.users) {
      if(user.access == "user") {
        groupUsers.push(user);
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
        this.updateChannelUsers(selectedGroup, selectedChannel, selectedUsers);
      }
    });

    this.channelUsersRef = null;
  }

  // Update channel users based from result from dialog.
  // Store data to the JSON file.
  updateChannelUsers(selectedGroup, selectedChannel, selectedUsers) {

    for(let user of this.adminUsers) {
      selectedUsers.push(user);
    }

    for(let group of this.data.groups) {
      if(group == selectedGroup) {
        for(let channel of group.channels) {
          if(channel == selectedChannel) {
            channel.users = selectedUsers;
          }
        }
      }
    }

    this.dataService.writeData(this.data);
    this.getGroups(this.data);
  }

  // Open group users dialog box.
  openGroupUsers(selectedGroup) {

    let users: UserModel[] = [];
    let groupUsers: UserModel[] = [];
    let selectedUsers: UserModel[] = [];

    for(let user of this.data.users) {
      if(user.access == 'user') {
        users.push(user);
      }
    }

    for(let user of selectedGroup.users) {
      if(user.access == 'user') {
        groupUsers.push(user);
      }
    }

    console.log('USERS: ', users);
    console.log('GROUP USERS: ', groupUsers);

    this.groupUsersRef = this.dialog.open(GroupUsersComponent, {
      disableClose: false,
      data: {
        users: users,
        groupUsers: groupUsers,
        groupName: selectedGroup.name
      }
    });

    this.groupUsersRef.afterClosed().subscribe((result) => {
      if(result) {
        console.log('CHANNEL USER RESULT: ', result);
        selectedUsers = result.selectedUsers;
        this.updateGroupUsers(selectedGroup, selectedUsers);
      }
    });

    this.groupUsersRef = null;
  }

  // Update group users based on the result of group user dialog
  updateGroupUsers(selectedGroup, selectedUsers) {
    for(let user of this.adminUsers) {
      selectedUsers.push(user);
    }

    for(let group of this.data.groups) {
      if(group == selectedGroup) {
        group.users = selectedUsers;
      }
    }

    this.dataService.writeData(this.data);
    this.getGroups(this.data);
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
        for(let i=0; i < this.data.groups.length; i++) {
          if(this.data.groups[i] == selectedGroup) {
            this.data.groups.splice(i, 1);
            this.dataService.writeData(this.data);
            this.getGroups(this.data);
          }
        }
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
        for(let group of this.data.groups) {
          if(group == selectedGroup) {
            for(let i=0; i < group.channels.length; i++) {
              if(group.channels[i] == selectedChannel) {
                group.channels.splice(i, 1);
                this.dataService.writeData(this.data);
                this.getGroups(this.data);
              }
            }
          }
        }
      }
    });

    this.deleteWarningRef = null;
  }

  // Close user table
  handleClose(event) {
    if(event) {
      this.panelOpened = !this.panelOpened;
    }
  }

}
