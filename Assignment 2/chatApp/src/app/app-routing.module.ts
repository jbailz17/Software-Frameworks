import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChannelComponent } from './channel/channel.component';

const routes: Routes = [
    {path: '', component:LoginComponent},
    {path: 'login', component:LoginComponent},
    {path: 'dashboard', component:DashboardComponent},
    {path: 'channel/:id/:name', component:ChannelComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}