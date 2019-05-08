import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckbox, MatCardModule, MatToolbarModule,
        MatExpansionModule, MatListModule, MatFormFieldModule, MatInputModule,
        MatIconModule, MatDialogModule, MatSelectModule, MatTableModule, 
        MatCheckboxModule, MatSidenavModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DataService } from './services/data-service/data.service';
import { AuthService } from './services/auth-service/auth.service';
import { ChannelComponent } from './channel/channel.component';
import { HeaderComponent } from './header/header.component';
import { AddGroupComponent } from './dashboard//add-group/add-group.component';
import { AddChannelComponent } from './dashboard/add-channel/add-channel.component';
import { ChannelUsersComponent } from './dashboard/channel-users/channel-users.component';
import { GroupUsersComponent } from './dashboard/group-users/group-users.component';
import { DeleteWarningComponent } from './dashboard/delete-warning/delete-warning.component';
import { UserTableComponent } from './dashboard/user-table/user-table.component';
import {AddUserComponent} from './dashboard/user-table/add-user/add-user.component';
import { SocketService } from './services/socket-service/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ChannelComponent,
    HeaderComponent,
    AddGroupComponent,
    AddChannelComponent,
    ChannelUsersComponent,
    GroupUsersComponent,
    DeleteWarningComponent,
    UserTableComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatSidenavModule
  ],
  entryComponents: [
    AddGroupComponent,
    AddChannelComponent,
    ChannelUsersComponent,
    GroupUsersComponent,
    DeleteWarningComponent,
    AddUserComponent
  ],
  providers: [ DataService, AuthService, SocketService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
