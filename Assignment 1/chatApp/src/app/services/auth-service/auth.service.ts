import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable()
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(false);
  status = this.loggedIn.asObservable();

  constructor() { 
    if(typeof(Storage) != 'undefined') {
      if(sessionStorage.getItem('username')) {
        this.loggedIn.next(true);
      }
    }
  }

  login() {
    this.loggedIn.next(true);
  }

  logout() {
    this.loggedIn.next(false);
  }

}
