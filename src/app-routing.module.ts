import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Component/core/guards/auth.guard';
import { LoggedInAuthGuard } from './Component/core/guards/logged-in-auth.guard';
import { LayoutComponent } from './Component/layout/layout.component';

const routes: Routes = [
  // { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: '', component: LayoutComponent, loadChildren: () => import('./Component/pages/pages.module').then(m => m.PagesModule), canActivate: [LoggedInAuthGuard] },
  { path: 'dashboards', component: LayoutComponent, loadChildren: () => import('./Component/pages/dashboards/dashboards.module').then(m => m.DashboardsModule), canActivate: [AuthGuard] },
  { path: 'TIIC', component: LayoutComponent, loadChildren: () => import('./Component/TIIC-Component/tiic.module').then(m => m.TIICModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
  // { path: 'snakbar', component: SnackbarComponent, canActivate: [AuthGuard] },
  // { path: 'loader', component: LoaderComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
