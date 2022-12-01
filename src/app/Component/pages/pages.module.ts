import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardsModule } from './dashboards/dashboards.module';
import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from '../TIIC-Component/set-password/set-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ValidateElementDirective } from 'src/app/CommoUtils/common-services/directives/validate-element.directive';



@NgModule({
  declarations: [ 
    LoginComponent,
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    DashboardsModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class PagesModule { }
