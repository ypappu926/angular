import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardATMComponent } from './dashboard-atm/dashboard-atm.component';
import { DefaultDashboardComponent } from './default/default.component';

const routes: Routes = [
    { path: '/dashboards', redirectTo: '/dashboards/Dashboard', pathMatch: 'full' },
    // { path: 'dashboard-1', component: DefaultDashboardComponent, data: { title: 'dashboard-1' } },
    { path: 'Dashboard', component: DashboardATMComponent, data: { title: 'dashboard' } }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
