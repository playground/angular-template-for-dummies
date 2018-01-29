import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    HostListener,
    ChangeDetectionStrategy,
    ContentChild,
    TemplateRef
} from '@angular/core';
import { scaleLinear, scalePoint, scaleTime } from 'd3-scale';
import { brushX } from 'd3-brush';
import { select, event as d3event } from 'd3-selection';
import { curveLinear } from 'd3-shape';
import { BaseChartComponent, ViewDimensions, ColorHelper, calculateViewDimensions } from '@swimlane/ngx-charts';
import { id } from '@swimlane/ngx-charts/release/utils';

@Component({
    selector: 'app-timeline-filter-chart',
    templateUrl: 'timeline-filter-chart.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        '../../../../../node_modules/@swimlane/ngx-charts/release/common/base-chart.component.css',
        './timeline-filter-chart.component.scss'
    ],
    encapsulation: ViewEncapsulation.None
})
export class TimelineFilterChartComponent extends BaseChartComponent {

    @Input() legend = true;
    @Input() legendTitle: string = 'Legend';
    @Input() xAxis = true;
    @Input() yAxis = true;
    @Input() showXAxisLabel;
    @Input() showYAxisLabel;
    @Input() xAxisLabel;
    @Input() yAxisLabel;
    @Input() timeline;
    @Input() gradient = true;
    @Input() showGridLines = false;
    @Input() curve: any = curveLinear;
    @Input() activeEntries: any[] = [];
    @Input() schemeType: string;
    @Input() xAxisTickFormatting: any;
    @Input() yAxisTickFormatting: any;
    @Input() roundDomains = false;
    @Input() tooltipDisabled = true;
    @Input() xScaleMin: any;
    @Input() xScaleMax: any;
    @Input() yScaleMin: number;
    @Input() yScaleMax: number;

    @Output() activate: EventEmitter<any> = new EventEmitter();
    @Output() deactivate: EventEmitter<any> = new EventEmitter();

    @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;
    @ContentChild('seriesTooltipTemplate') seriesTooltipTemplate: TemplateRef<any>;

    dims: ViewDimensions;
    scaleType: string;
    xDomain: any[];
    xSet: any[]; // the set of all values on the X Axis
    yDomain: any[];
    seriesDomain: any;
    xScale: any;
    yScale: any;
    transform: string;
    clipPathId: string;
    clipPath: string;
    colors: ColorHelper;
    margin = [10, 20, 10, 20];
    hoveredVertical: any; // the value of the x axis that is hovered over
    xAxisHeight = 0;
    yAxisWidth: number = 0;
    filteredDomain: any;
    legendOptions: any;

    timelineWidth: any;
    timelineHeight: number = 50;
    timelineXScale: any;
    timelineYScale: any;
    timelineXDomain: any;
    timelineTransform: any;
    timelinePadding: number = 10;


    // ------ BRUSH START
    initialized = false;
    filterId: any;
    filter: any;
    brush: any;
    timeScale: any;
    @Output() onFilter = new EventEmitter();
    // ------ BRUSH END

    update(): void {
        super.update();

        this.dims = calculateViewDimensions({
            width: this.width,
            height: this.height,
            margins: this.margin,
            showXAxis: this.xAxis,
            showYAxis: this.yAxis,
            xAxisHeight: this.xAxisHeight,
            yAxisWidth: this.yAxisWidth,
            showXLabel: this.showXAxisLabel,
            showYLabel: this.showYAxisLabel,
            showLegend: this.legend,
            legendType: this.schemeType
        });

        if (this.timeline) {
            this.dims.height -= (this.timelineHeight + this.margin[2] + this.timelinePadding);
        }

        this.xDomain = this.getXDomain();
        if (this.filteredDomain) {
            this.xDomain = this.filteredDomain;
        }

        this.yDomain = this.getYDomain();
        this.seriesDomain = this.getSeriesDomain();

        this.xScale = this.getXScale(this.xDomain, this.dims.width);
        this.yScale = this.getYScale(this.yDomain, this.dims.height);

        for (let i = 0; i < this.xSet.length; i++) {
            const val = this.xSet[i];
            let d0 = 0;
            for (const group of this.results) {

                let d = group.series.find(item => {
                    let a = item.name;
                    let b = val;
                    if (this.scaleType === 'time') {
                        a = a.valueOf();
                        b = b.valueOf();
                    }
                    return a === b;
                });

                if (d) {
                    d.d0 = d0;
                    d.d1 = d0 + d.value;
                    d0 += d.value;
                } else {
                    d = {
                        name: val,
                        value: 0,
                        d0,
                        d1: d0
                    };
                    group.series.push(d);
                }
            }
        }

        this.updateTimeline();

        this.setColors();
        this.legendOptions = this.getLegendOptions();

        this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;

        this.clipPathId = 'clip' + id().toString();
        this.clipPath = `url(#${this.clipPathId})`;

        // ------- BRUSH START
        if (this.brush) {
            this.updateBrush();
        }

        this.filterId = 'filter' + id().toString();
        this.filter = `url(#${this.filterId})`;

        if (!this.initialized) {
            this.addBrush();
            this.initialized = true;
        }

        this.timeScale = this.getTimeScale(this.xDomain, this.dims.width);

        // -------- BRUSH END
    }

    updateTimeline(): void {
        if (this.timeline) {
            this.timelineWidth = this.dims.width;
            this.timelineXDomain = this.getXDomain();
            this.timelineXScale = this.getXScale(this.timelineXDomain, this.timelineWidth);
            this.timelineYScale = this.getYScale(this.yDomain, this.timelineHeight);
            this.timelineTransform = `translate(${this.dims.xOffset}, ${-this.margin[2]})`;
        }
    }

    getXDomain(): any[] {
        let values = [];

        for (const results of this.results) {
            for (const d of results.series) {
                if (!values.includes(d.name)) {
                    values.push(d.name);
                }
            }
        }

        this.scaleType = this.getScaleType(values);
        let domain = [];

        if (this.scaleType === 'linear') {
            values = values.map(v => Number(v));
        }

        let min;
        let max;
        if (this.scaleType === 'time' || this.scaleType === 'linear') {
            min = this.xScaleMin
                ? this.xScaleMin
                : Math.min(...values);

            max = this.xScaleMax
                ? this.xScaleMax
                : Math.max(...values);
        }

        if (this.scaleType === 'time') {
            domain = [new Date(min), new Date(max)];
            this.xSet = [...values].sort((a, b) => {
                const aDate = a.getTime();
                const bDate = b.getTime();
                if (aDate > bDate) { return 1; }
                if (bDate > aDate) { return -1; }
                return 0;
            });
        } else if (this.scaleType === 'linear') {
            domain = [min, max];
            // Use compare function to sort numbers numerically
            this.xSet = [...values].sort((a, b) => (a - b));
        } else {
            domain = values;
            this.xSet = values;
        }

        return domain;
    }

    getYDomain(): any[] {
        const domain = [];

        for (let i = 0; i < this.xSet.length; i++) {
            const val = this.xSet[i];
            let sum = 0;
            for (const group of this.results) {
                const d = group.series.find(item => {
                    let a = item.name;
                    let b = val;
                    if (this.scaleType === 'time') {
                        a = a.valueOf();
                        b = b.valueOf();
                    }
                    return a === b;
                });

                if (d) {
                    sum += d.value;
                }
            }

            domain.push(sum);
        }

        const min = this.yScaleMin
            ? this.yScaleMin
            : Math.min(0, ...domain);

        const max = this.yScaleMax
            ? this.yScaleMax
            : Math.max(...domain);
        return [min, max];
    }

    getSeriesDomain(): any[] {
        return this.results.map(d => d.name);
    }

    getXScale(domain, width): any {
        let scale;

        if (this.scaleType === 'time') {
            scale = scaleTime();
        } else if (this.scaleType === 'linear') {
            scale = scaleLinear();
        } else if (this.scaleType === 'ordinal') {
            scale = scalePoint()
                .padding(0.1);
        }

        scale
            .range([0, width])
            .domain(domain);

        return this.roundDomains ? scale.nice() : scale;
    }

    getYScale(domain, height): any {
        const scale = scaleLinear()
            .range([height, 0])
            .domain(domain);
        return this.roundDomains ? scale.nice() : scale;
    }

    getScaleType(values): string {
        let date = true;
        let num = true;

        for (const value of values) {
            if (!this.isDate(value)) {
                date = false;
            }
            if (typeof value !== 'number') {
                num = false;
            }
        }

        if (date) {
            return 'time';
        }

        if (num) {
            return 'linear';
        }

        return 'ordinal';
    }

    isDate(value): boolean {
        if (value instanceof Date) {
            return true;
        }

        return false;
    }

    updateDomain(domain): void {
        this.filteredDomain = domain;
        this.xDomain = this.filteredDomain;
        this.xScale = this.getXScale(this.xDomain, this.dims.width);
    }

    updateHoveredVertical(item) {
        this.hoveredVertical = item.value;
        this.deactivateAll();
    }

    @HostListener('mouseleave')
    hideCircles(): void {
        this.hoveredVertical = null;
        this.deactivateAll();
    }

    onClick(data, series?): void {
        if (series) {
            data.series = series.name;
        }

        this.select.emit(data);
    }

    trackBy(index, item): string {
        return item.name;
    }

    setColors(): void {
        let domain;
        if (this.schemeType === 'ordinal') {
            domain = this.seriesDomain;
        } else {
            domain = this.yDomain;
        }

        this.colors = new ColorHelper(this.scheme, this.schemeType, domain, this.customColors);
    }

    getLegendOptions() {
        const opts = {
            scaleType: this.schemeType,
            colors: undefined,
            domain: [],
            title: undefined
        };
        if (opts.scaleType === 'ordinal') {
            opts.domain = this.seriesDomain;
            opts.colors = this.colors;
            opts.title = this.legendTitle;
        } else {
            opts.domain = this.yDomain;
            opts.colors = this.colors.scale;
        }
        return opts;
    }

    updateYAxisWidth({ width }): void {
        this.yAxisWidth = width;
        this.update();
    }

    updateXAxisHeight({ height }): void {
        this.xAxisHeight = height;
        this.update();
    }

    onActivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });
        if (idx > -1) {
            return;
        }

        this.activeEntries = [item, ...this.activeEntries];
        this.activate.emit({ value: item, entries: this.activeEntries });
    }

    onDeactivate(item) {
        const idx = this.activeEntries.findIndex(d => {
            return d.name === item.name && d.value === item.value;
        });

        this.activeEntries.splice(idx, 1);
        this.activeEntries = [...this.activeEntries];

        this.deactivate.emit({ value: item, entries: this.activeEntries });
    }

    deactivateAll() {
        this.activeEntries = [...this.activeEntries];
        for (const entry of this.activeEntries) {
            this.deactivate.emit({ value: entry, entries: [] });
        }
        this.activeEntries = [];
    }


    // ------------------ BRUSH START
    addBrush(): void {
        if (this.brush) { return; }

        const height = this.height;
        const width = this.width;

        this.brush = brushX()
            .extent([[0, 0], [width, height]])
            .on('end', () => {
                const selection = d3event.selection || this.xScale.range();
                const newDomain = selection.map(this.timeScale.invert);

                this.onFilter.emit(newDomain);
                this.cd.markForCheck();
            });

        select(this.chartElement.nativeElement)
            .select('.brush')
            .call(this.brush);
    }

    updateBrush(): void {
        if (!this.brush) { return; }

        const height = this.dims.height;
        const width = this.dims.width;

        this.brush.extent([[0, 0], [width, height]]);
        select(this.chartElement.nativeElement)
            .select('.brush')
            .call(this.brush);

        // clear hardcoded properties so they can be defined by CSS
        select(this.chartElement.nativeElement).select('.selection')
            .attr('fill', undefined)
            .attr('stroke', undefined)
            .attr('fill-opacity', undefined);

        this.cd.markForCheck();
    }


    getTimeScale(domain, width): any {
        return scaleTime()
            .range([0, width])
            .domain(domain);
    }

    // --------------------- BRUSH END
}
