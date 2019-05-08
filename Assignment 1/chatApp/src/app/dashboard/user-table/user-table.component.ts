import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import {SelectionModel, DataSource} from '@angular/cdk/collections';

import { UserModel } from '../../models/user.model';
import { DataModel } from '../../models/data.model';

import {DataService} from '../../services/data-service/data.service';

import {DeleteWarningComponent} from '../delete-warning/delete-warning.component';
import {AddUserComponent} from './add-user/add-user.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<boolean>();
  @Input() data: DataModel;
  isSuper: boolean;

  deleteWarningRef: MatDialogRef<DeleteWarningComponent>;
  addUserRef: MatDialogRef<AddUserComponent>;

  displayedColumns: string[] = ['user', 'group', 'super'];
  dataSource;
  groupAdmin;
  superAdmin;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog) {

    if(typeof(Storage) != 'undefined'){
      if(sessionStorage.getItem('access') == 'super-admin') {
        this.isSuper = true;
        this.displayedColumns = ['user', 'group', 'super', 'delete'];
      }
    }

  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource(this.data.users);
    this.groupAdmin = new SelectionModel(true, []);
    this.superAdmin = new SelectionModel(true, []);

    for(let user of this.data.users) {
      if(user.access == 'super-admin') {
        this.superAdmin.select(user);
      }
      if(user.access == 'group-admin') {
        this.groupAdmin.select(user);
      }
    }

  }

  // Updates the current table.
  updateTable() {
    this.dataSource = new MatTableDataSource(this.data.users);
    for(let user of this.data.users) {
      if(user.access == 'super-admin') {
        this.superAdmin.select(user);
      }
      if(user.access == 'group-admin') {
        this.groupAdmin.select(user);
      }
    }
  }

  // Toggels super admin check box
  toggleSuper(user) {
    if(this.groupAdmin.isSelected(user)) {
      this.superAdmin.toggle(user);
      this.groupAdmin.toggle(user);
    } else {
      this.superAdmin.toggle(user);
    }
  }

  // Toggles group admin check box
  toggleGroup(user){
    if(this.superAdmin.isSelected(user)) {
      this.superAdmin.toggle(user);
      this.groupAdmin.toggle(user);
    } else {
      this.groupAdmin.toggle(user);
    }
  }

  // Updates users based on current user table.
  onSubmit() {
    
    this.updateUsers();
    this.dataService.writeData(this.data);
    console.log(this.data);
  }

  // Updates the users in the JSON file.
  updateUsers() {

    for(let user of this.data.users){
      if(!this.superAdmin.isSelected(user) && !this.groupAdmin.isSelected(user)) {
        user.access="user";
        this.updateGroups(user);
      } else if (this.superAdmin.isSelected(user)) {
        user.access="super-admin";
        this.updateGroups(user);
        this.accessAllGroups(user);
      } else if (this.groupAdmin.isSelected(user)) {
        user.access="group-admin";
        this.updateGroups(user);
        this.accessAllGroups(user);
      }
    }

  }

  // Updates the user information in each group.
  updateGroups(user) {
    for (let group of this.data.groups) {

      for(let groupUser of group.users) {
        if(groupUser.username == user.username) {
          if(!this.superAdmin.isSelected(user) && !this.groupAdmin.isSelected(user)) {
            groupUser.access="user";
          } else if (this.superAdmin.isSelected(user)) {
            groupUser.access="super-admin";
          } else if (this.groupAdmin.isSelected(user)) {
            groupUser.access="group-admin";
          }
        }
      }

      for(let channel of group.channels) {
        for(let channelUser of channel.users) {
          if(channelUser.username == user.username) {
            if(!this.superAdmin.isSelected(user) && !this.groupAdmin.isSelected(user)) {
              channelUser.access="user";
            } else if (this.superAdmin.isSelected(user)) {
              channelUser.access="super-admin";
            } else if (this.groupAdmin.isSelected(user)) {
              channelUser.access="group-admin";
            }
          }
        }
      }

    }
  }
  
  // Grants admin users access to all groups and channels
  accessAllGroups(user) {
    for(let group of this.data.groups) {

      if(!group.users.find(groupUser => groupUser.username == user.username)) {
        group.users.push(user);
      }

      for (let channel of group.channels) {
        if(!channel.users.find(channelUser => channelUser.username == user.username)) {
          channel.users.push(user);
        }
      }
    }
  }

  // Deletes the selected user.
  deleteUser(selectedUser) {

    this.deleteWarningRef = this.dialog.open(DeleteWarningComponent, {
      disableClose: false,
      data: {
        item: selectedUser.username
      }
    });

    this.deleteWarningRef.afterClosed().subscribe((result) => {
      if(result) {
        for(let i = 0; i < this.data.users.length; i++){
          if(this.data.users[i] == selectedUser) {
            this.data.users.splice(i, 1);
          }
        }
        this.removeUserFromGroup(selectedUser);
        this.updateTable();
        this.dataService.writeData(this.data);
      }
    })

    this.deleteWarningRef = null;
  }

  // Removes the deleted user from the groups and channels they are in.
  removeUserFromGroup(selectedUser) {

    for(let group of this.data.groups) {

      for(let i = 0; i < group.users.length; i++) {
        if(group.users[i] == selectedUser) {
          group.users.splice(i, 1);
        }
      }

      for(let channel of group.channels) {
        for(let i = 0; i < channel.users.length; i++) {
          if(channel.users[i] == selectedUser) {
            channel.users.splice(i, 1);
          }
        }
      }

    }

  }

  // Opens add user dialog.
  openAddUser() {
    this.addUserRef = this.dialog.open(AddUserComponent, {
      disableClose: false,
      data: {
        users: this.data.users
      }
    });

    this.addUserRef.afterClosed().subscribe((result) => {
      if(result) {
        this.addUser(result.newUser);
      }
    })

    this.addUserRef = null;
  }

  // Adds a new user and stores the result in the JSON file.
  addUser(newUser) {
    this.data.users.push(newUser);

    if(newUser.access == 'super-admin' || newUser.access == 'group-admin') {
      this.accessAllGroups(newUser);
    }

    this.updateTable();
    this.dataService.writeData(this.data);
  }

  // close user table
  close() {
    this.closeEvent.emit(true);
  }

}
