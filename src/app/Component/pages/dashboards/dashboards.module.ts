import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// tslint:disable-next-line: max-line-length
import { NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule, NgbCollapseModule, NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';

import { UIModule } from '../../shared/ui/ui.module';
import { DashboardsRoutingModule } from './dashboards-routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { DefaultDashboardComponent } from './default/default.component';
import { DashboardATMComponent } from './dashboard-atm/dashboard-atm.component';

@NgModule({
  declarations: [DefaultDashboardComponent,DashboardATMComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgApexchartsModule,
    ChartsModule,
    NgbCollapseModule,
    NgSelectModule,
    UIModule,
    NgbModule,
    DashboardsRoutingModule
  ]
})
export class DashboardsModule { }
