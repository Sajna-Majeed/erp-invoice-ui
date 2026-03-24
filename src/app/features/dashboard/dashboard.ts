import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared-imports';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  stats = [
    { title: 'Customers', value: 120, icon: 'pi pi-users', color: '#4CAF50' },
    { title: 'Products', value: 45, icon: 'pi pi-box', color: '#2196F3' },
    { title: 'Quotes', value: 32, icon: 'pi pi-file', color: '#FF9800' },
    { title: 'Revenue', value: '₹ 2.5L', icon: 'pi pi-chart-line', color: '#9C27B0' }
  ];

  chartData: any;
  chartOptions: any;

  recentQuotes: any[] = [];

  ngOnInit() {
    this.loadChart();
    this.loadRecentData();
  }

  loadChart() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Quotes',
          data: [10, 20, 15, 30, 25],
          fill: false,
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { position: 'top' }
      }
    };
  }

  loadRecentData() {
    this.recentQuotes = [
      { customer: 'ABC Pvt Ltd', amount: 12000, date: '2026-03-20' },
      { customer: 'XYZ Ltd', amount: 8500, date: '2026-03-18' },
      { customer: 'TechSoft', amount: 15000, date: '2026-03-15' }
    ];
  }
}