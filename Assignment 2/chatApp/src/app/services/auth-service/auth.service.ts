import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Observable, BehaviorSubject} from 'rxjs';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  status = this.loggedIn.asObservable();

  constructor(private http: Http,
    private router: Router ) { 
    if(typeof(Storage) != 'undefined') {
      if(sessionStorage.getItem('username')) {
        this.loggedIn.next(true);
      }
    }
  }

  // Login current user if username and password is correct. Set local storage data with current user info.
  login(username: string, password: string) {
    let url = environment.apiUrl + '/user';
    this.http.get(url, {params: {username: username, password: password}}).toPromise().then((res) => {
      let response = res.json();
      if(response.error) {
        console.log('Error: ', response);
        alert(response.error);
        return;
      }

      console.log(response);

      if(typeof(Storage) != 'undefined') {
        sessionStorage.setItem('username', response.username);
        sessionStorage.setItem('access', response.access);
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('_id', response._id);
        sessionStorage.setItem('imagePath', response.imagePath);
      } else {
        console.log('Unable to set local storage');
        return;
      }

      this.loggedIn.next(true);
      this.router.navigate(['/dashboard']);
      return;
    });
  }

  // Logout current user and clear local storage data.
  logout() {
    if(typeof(Storage) != 'undefined') {
      sessionStorage.clear();
    } else {
      console.log('Unable to logout');
      return;
    }

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
    return;
  }



}
