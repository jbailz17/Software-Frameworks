import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {DataService} from '../services/data-service/data.service';
import {AuthService} from '../services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  data: any;
  dataConnection;

  constructor(private router: Router,
    private form: FormsModule,
    private dataService: DataService,
    private authService: AuthService) { }

  ngOnInit() {

    if(typeof(Storage) != 'undefined') {
      if(sessionStorage.getItem('username')) {
        this.router.navigate(['/dashboard']);
        return;
      }
    }

    this.dataService.getData().then((res) => {
        this.data = res.json().users;
      }).catch((err) => {
        console.log('Unable to retrieve data: ', err);
    });
  }

  // Login user after they have entered the corect username
  onSubmit(event) {
    
    if(typeof(Storage) != 'undefined') {
      if(this.username && this.data) {
        for(let user of this.data) {
          if(this.username == user.username) {
            sessionStorage.setItem('username', this.username);
            sessionStorage.setItem('access', user.access);
            this.authService.login();
            this.router.navigate(['/dashboard']);
            return;
          }
        }
      }
      alert('Invalid Username');
    }
  }

}
