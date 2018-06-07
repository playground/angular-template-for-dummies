import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SampleDashboardComponent } from './sample-dashboard/sample-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    GridsterModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent,
    SampleDashboardComponent
  ]
})
export class DashboardModule {
  constructor() {
    console.debug(this.constructor.name);
  }
}
