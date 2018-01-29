import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ShowcaseComponent } from './showcase/showcase.component';
import { TimelineFilterBarChartComponent } from './custom-charts/timeline-filter-bar-chart/timeline-filter-bar-chart.component';
import { TimelineFilterChartComponent } from './custom-charts/timeline-filter-chart/timeline-filter-chart.component';
import { CustomChartsShowcaseComponent } from './custom-charts/custom-charts-showcase/custom-charts-showcase.component';


@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  declarations: [
    ShowcaseComponent,
    TimelineFilterBarChartComponent,
    TimelineFilterChartComponent,
    CustomChartsShowcaseComponent
  ],
  exports: [
    ShowcaseComponent
  ]
})
export class ChartsModule { }
