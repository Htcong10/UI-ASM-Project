import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../../../app.component';

@Component({
  selector: 'app-trang-chu',
  templateUrl: './trang-chu.component.html',
  styleUrls: ['./trang-chu.component.scss']
})
export class TrangChuComponent implements OnInit {
    chartData: any;
    chartOptions: any;
  constructor(public app: AppComponent) { }

  ngOnInit(): void {
      this.chartData = this.getChartData();
      this.chartOptions = this.getChartOptions();
  }
    getChartData() {
        const isLight = this.app.layoutMode === 'light';
        const completedColors = {
            borderColor: isLight ? '#00ACC1' : '#4DD0E1',
            backgroundColor: isLight ? 'rgb(0, 172, 193, .3)' : 'rgb(77, 208, 225, .3)'
        };
        const canceledColors = {
            borderColor: isLight ? '#FF9800' : '#FFB74D',
            backgroundColor: isLight ? 'rgb(255, 152, 0, .3)' : 'rgb(255, 183, 77, .3)'
        };

        return {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Tiền điện',
                    data: [65, 60, 80, 81, 56, 55, 40],
                    borderColor: completedColors.borderColor,
                    backgroundColor: completedColors.backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: .4
                },
                {
                    label: 'Tiền dịch vụ',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: canceledColors.borderColor,
                    backgroundColor: canceledColors.backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: .4
                }
            ]
        };
    }
    getChartOptions() {
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
        const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
        return {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridLinesColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridLinesColor
                    }
                }
            }
        };
    }
}
