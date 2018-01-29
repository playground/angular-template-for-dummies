import { Component, OnInit } from '@angular/core';
import { colorSets } from '@swimlane/ngx-charts/release/utils';

@Component({
  selector: 'app-custom-charts-showcase',
  templateUrl: './custom-charts-showcase.component.html',
  styleUrls: ['./custom-charts-showcase.component.scss']
})
export class CustomChartsShowcaseComponent implements OnInit {


  timelineFilterMulti: any[];

  colorScheme: any;

  constructor() { }

  ngOnInit() {
    this.colorScheme = colorSets[0];
    this.timelineFilterMulti = this.generateData();
  }

  generateData(): any[] {
    const results: any[] = [];
    const dataPoints = 20;
    const domain: Date[] = [];
    const dayLength = 24 * 60 * 60 * 1000;
    const numSeries = 5;

    for (let s = 0; s < numSeries; s++) {
      let date = new Date().valueOf();
      const seriesData: any[] = [];

      for (let j = 0; j < dataPoints; j++) {
        seriesData.push({
          name: new Date(date),
          value: Math.floor(Math.random() * 300)
        });
        date += dayLength;
      }
      const series = {
        name: 'Series ' + s,
        series: seriesData
      };
      results.push(series);
    }

    return results;
  }

  onFilter(event: any[]) {
    console.log(event);
  }

  select(data) {
    console.log('Item clicked', data);
  }



}
