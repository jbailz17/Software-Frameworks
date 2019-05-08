import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedIn: boolean = false;
  subscription;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.authService.status.subscribe((status) => {
      this.loggedIn = status;
    });
  }

  // Logout current user and clear local storage
  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
