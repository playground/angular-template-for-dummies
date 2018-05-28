import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { DashboardComponent } from '../showcase/dashboard/dashboard.component';

// TODO: Split routings into modules
export const NAVIGATION_ROUTES: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'under-construction', component: UnderConstructionComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(NAVIGATION_ROUTES) ],
  exports: [ RouterModule ]
})
export class FacadeRoutingModule {}


