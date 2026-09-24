import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgApexchartsModule, ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexDataLabels, ApexStroke, ApexYAxis, ApexLegend, ApexTooltip, ApexPlotOptions, ApexGrid, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  isLoading = true;

  @ViewChild('chart') chart!: ChartComponent;
  public transactionsTrendOptions!: Partial<ChartOptions>;
  public donationTrendOptions!: Partial<ChartOptions>;
  public donationsByCauseOptions!: Partial<ChartOptions>;
  public transactionStatusOptions!: Partial<ChartOptions>;

  private destroyRef = inject(DestroyRef);

  constructor(
    private mockApi: AdminMockApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.initCharts();
  }

  ngOnInit() {
    this.loadStats();
  }

  initCharts() {
    this.transactionsTrendOptions = {
      series: [
        {
          name: 'Total Transactions',
          type: 'column',
          data: [600, 1000, 1400, 1500, 1200, 1400, 1700, 1800, 2100, 2400]
        },
        {
          name: 'Matched Transactions',
          type: 'line',
          data: [500, 800, 1100, 1050, 950, 1150, 1350, 1450, 1600, 2050]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false }
      },
      stroke: {
        width: [0, 3],
        curve: 'smooth'
      },
      colors: ['#ff9fb3', '#2a85ff'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'],
      xaxis: {
        type: 'category'
      },
      yaxis: {
        min: 0,
        max: 2500,
        tickAmount: 5
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        borderColor: '#f1f1f1'
      }
    };

    this.donationTrendOptions = {
      series: [
        {
          name: 'Donation Amount (Bar)',
          type: 'column',
          data: [1100, 1500, 1700, 2200, 1800, 2400, 2800, 3100, 4100, 4400]
        },
        {
          name: 'Donation Amount (Line)',
          type: 'line',
          data: [1200, 1800, 1750, 2400, 1950, 2550, 2900, 3300, 4300, 4500]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false }
      },
      stroke: {
        width: [0, 3],
        curve: 'smooth'
      },
      colors: ['#6cce95', '#249c5e'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026'],
      xaxis: {
        type: 'category'
      },
      yaxis: {
        min: 0,
        max: 5000,
        tickAmount: 5
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        borderColor: '#f1f1f1'
      }
    };

    this.donationsByCauseOptions = {
      series: [37, 23, 15, 11, 9, 5],
      labels: ['Education', 'Children & Youth', 'Healthcare', 'Environment', 'Senior Citizens', 'Community Welfare'],
      chart: {
        type: 'donut',
        height: 350
      },
      colors: ['#ff4d6d', '#ff9fb3', '#2a85ff', '#6cce95', '#f9a826', '#a55eea'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: '#666'
              },
              value: {
                show: true,
                fontSize: '20px',
                fontWeight: 600,
                formatter: (val) => val + '%'
              },
              total: {
                show: true,
                label: 'Total Donations',
                formatter: () => 'SGD 25,008'
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'right',
        offsetY: 30
      }
    };

    this.transactionStatusOptions = {
      series: [96, 4, 1, 1],
      labels: ['Matched', 'Unmatched', 'Pending', 'Returned / Cancelled'],
      chart: {
        type: 'donut',
        height: 350
      },
      colors: ['#249c5e', '#ff4d6d', '#f9a826', '#4a4a4a'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                color: '#666'
              },
              value: {
                show: false
              },
              total: {
                show: true,
                label: 'Transactions',
                formatter: () => '15,820'
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'right',
        offsetY: 30
      }
    };
  }

  loadStats() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.mockApi.getDashboardStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.stats = res.data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
