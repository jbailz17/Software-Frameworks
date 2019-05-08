import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import {SelectionModel, DataSource} from '@angular/cdk/collections';

import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-channel-users',
  templateUrl: './channel-users.component.html',
  styleUrls: ['./channel-users.component.css']
})
export class ChannelUsersComponent implements OnInit {

  channelUsers: UserModel[] = [];
  groupUsers: UserModel[] = [];
  channelName: string;

  displayedColumns: string[] = ['user', 'select'];
  dataSource;
  selection;

  constructor( public dialogRef: MatDialogRef<ChannelUsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {  
    this.channelUsers = data.channelUsers;
    this.groupUsers = data.groupUsers;
    this.channelName = data.channelName;
  }

  ngOnInit() {

    this.dataSource = new MatTableDataSource(this.groupUsers);
    this.selection = new SelectionModel(true, []);

    for(let channelUser of this.channelUsers) {
      for(let groupUser of this.dataSource.data) {
        if(channelUser.username == groupUser.username) {
          this.selection.select(groupUser);
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
