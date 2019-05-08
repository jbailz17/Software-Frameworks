import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  users: UserModel[] = [];

  newUser: any;
  username: string;
  email: string;
  access: string;

  accessLevels: string[] = ['Super Admin', 'Group Admin', 'User'];

  constructor( public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.users = data.users;

      if(typeof(Storage) != 'undefined'){
        if(sessionStorage.getItem('access') == 'super-admin') {
          this.accessLevels = ['Super Admin', 'Group Admin', 'User'];
        } else {
          this.accessLevels = ['Group Admin', 'User'];
        }
      }

  }

  ngOnInit() {
  }

  onSubmit(event) {

    for(let user of this.users) {
      if(user.username == this.username) {
        alert(this.username + ' has already been taken');
        return;
      }
    }

    this.newUser = new UserModel();
    this.newUser.username = this.username;
    this.newUser.email = this.email;

    if(this.access == 'Super Admin') {
      this.newUser.access = 'super-admin';
    } else if (this.access == 'Group Admin') {
      this.newUser.access = 'group-admin';
    } else if (this.access == 'User') {
      this.newUser.access = 'user';
    }

    console.log('NEW USER: ', this.newUser);

    this.dialogRef.close({
      newUser: this.newUser
    });
  }

}
