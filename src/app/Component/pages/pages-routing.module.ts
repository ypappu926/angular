import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetPasswordComponent } from '../TIIC-Component/set-password/set-password.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  //  dashboards/dashboard-2
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'login', component: LoginComponent, data: { title: 'TamilNadu - Login Page' } },  
  { path: 'ChangePassword', component: SetPasswordComponent, data: { title: 'TamilNadu - Change Password Page' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
