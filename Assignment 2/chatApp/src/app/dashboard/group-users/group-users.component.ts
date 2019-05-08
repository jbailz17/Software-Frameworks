import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import {SelectionModel, DataSource} from '@angular/cdk/collections';

import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.css']
})
export class GroupUsersComponent implements OnInit {

  users: UserModel[] = [];
  groupUsers: UserModel[] = [];
  groupName: string;

  displayedColumns: string[] = ['user', 'select'];
  dataSource;
  selection;

  constructor( public dialogRef: MatDialogRef<GroupUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {  
    this.users = data.users;
    this.groupUsers = data.groupUsers;
    this.groupName = data.groupName;
  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource(this.users);
    this.selection = new SelectionModel(true, []);

    for(let groupUser of this.groupUsers) {
      for(let user of this.dataSource.data) {
        if(user.username == groupUser.username) {
          this.selection.select(user);
        }
      }
    }

    console.log('SELECTED: ', this.selection);

    console.log('DATASOURCE: ', this.dataSource);
  }

  // Returns the selected users from the table.
  onSubmit() {
    this.dialogRef.close({
      selectedUsers: this.selection.selected
    });
  }

}
