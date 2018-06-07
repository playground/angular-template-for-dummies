import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SampleDashboardComponent } from './sample-dashboard/sample-dashboard.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: DashboardComponent,
      children: [
        { path: 'sample-dashboard', component: SampleDashboardComponent }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }


