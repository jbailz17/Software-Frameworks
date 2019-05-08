import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  users: UserModel[] = [];
  addedUsers: UserModel[] = [];
  groupName: string;

  constructor( public dialogRef: MatDialogRef<AddGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    
    this.users = data.users;
  }

  ngOnInit() {
  }

  // Returns the new group.
  onSubmit(event) {

    this.dialogRef.close({
      groupName: this.groupName,
      addedUsers: this.addedUsers
    });
  }

}
