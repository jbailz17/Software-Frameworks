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
  password: string;
  data: any;
  dataConnection;

  constructor(private router: Router,
    private form: FormsModule,
    private dataService: DataService,
    private authService: AuthService) { }

  ngOnInit() {
    // If user is already logged in navigate to dashboard.
    if(typeof(Storage) != 'undefined') {
      if(sessionStorage.getItem('username')) {
        this.router.navigate(['/dashboard']);
        return;
      }
    }
  }

  // Login user after they have entered the corect username and password
  onSubmit(event) {

    this.authService.login(this.username, this.password);
  }

}
