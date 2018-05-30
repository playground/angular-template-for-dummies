import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { ThreeExamplesModule } from '../three-examples/three-examples.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    ThreeExamplesModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class ShowcaseModule { }
