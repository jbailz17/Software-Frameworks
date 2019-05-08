import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {

  users: UserModel[] = [];
  addedUsers: UserModel[] = [];
  channelName: string;

  constructor( public dialogRef: MatDialogRef<AddChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {  
    this.users = data.users;
  }

  ngOnInit() {
  }

  // Returns the newly added channel.
  onSubmit(event) {
    this.dialogRef.close({
      channelName: this.channelName,
      addedUsers: this.addedUsers
    });
  }

}
