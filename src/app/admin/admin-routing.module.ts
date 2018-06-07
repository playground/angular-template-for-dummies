import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: AdminComponent,
      children: [
        { path: 'under-construction', component: UnderConstructionComponent },
        { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }


