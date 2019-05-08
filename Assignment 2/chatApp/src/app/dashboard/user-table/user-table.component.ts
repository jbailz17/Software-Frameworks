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

  users: UserModel[] = [];
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

    this.setTable();

  }

  // Setup data in the user table.
  setTable() {
    this.dataService.getUsersInfo(sessionStorage.getItem('_id')).then((res) => {
      if(res) {
        this.users = res.json();

        this.dataSource = new MatTableDataSource(this.users);
        this.groupAdmin = new SelectionModel(true, []);
        this.superAdmin = new SelectionModel(true, []);

        for(let user of this.users) {
          if(user.access == 'super-admin') {
            this.superAdmin.select(user);
          }
          if(user.access == 'group-admin') {
            this.groupAdmin.select(user);
          }
        }
      }
    });
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
    this.dataService.updateUsers(this.users).then((res) => {
      if(res) {
        this.close();
      }
    });
  }

  // Updates the users in mongo database.
  updateUsers() {

    for(let user of this.users){
      if(!this.superAdmin.isSelected(user) && !this.groupAdmin.isSelected(user)) {
        user.access="user";
      } else if (this.superAdmin.isSelected(user)) {
        user.access="super-admin";
      } else if (this.groupAdmin.isSelected(user)) {
        user.access="group-admin";
      }
    }

  }

  // Deletes the selected user.
  deleteUser(selectedUser) {

    console.log('USERID: ', selectedUser._id);

    this.deleteWarningRef = this.dialog.open(DeleteWarningComponent, {
      disableClose: false,
      data: {
        item: selectedUser.username
      }
    });

    this.deleteWarningRef.afterClosed().subscribe((result) => {
      if(result) {
        this.dataService.deleteUser(selectedUser._id).then((res) => {
          if(res) {
            this.setTable();
          }
        });
      }
    })

    this.deleteWarningRef = null;
  }

  // Opens add user dialog.
  openAddUser() {
    this.addUserRef = this.dialog.open(AddUserComponent, {
      disableClose: false,
      data: {
        users: this.users
      }
    });

    this.addUserRef.afterClosed().subscribe((result) => {
      if(result) {
        this.addUser(result.newUser);
      }
    })

    this.addUserRef = null;
  }

  // Adds a new user and stores the data in the mongo database.
  addUser(newUser) {
    this.dataService.createUser(newUser).then((res) => {
      if(res) {
        this.setTable();
      }
    });
  }

  // close user table
  close() {
    this.closeEvent.emit(true);
  }

}
