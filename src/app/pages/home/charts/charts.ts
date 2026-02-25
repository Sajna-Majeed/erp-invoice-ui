import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../../core/service/api-services/dashboard/dashboard';
@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule],
  templateUrl: './charts.html',
  styleUrls: ['./charts.css']
})
export class Charts implements OnInit {

  constructor(private dashboardService: DashboardService) {}

  // ------- PIE OPTIONS (COMMON OPTIONS) -------
  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: { size: 14 }
        }
      },
      tooltip: {
    callbacks: {
    label: (ctx) => {
      const rawValue = ctx.raw as number;
      const dataset = ctx.dataset.data as number[];
      const total = dataset.reduce((a, b) => a + b, 0);
      const percentage = ((rawValue / total) * 100).toFixed(1);
      return `${ctx.label}: ${rawValue} (${percentage}%)`;
    }
  }
}

    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutQuart'
    }
  };

  // ------- LINE OPTIONS -------
  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic'
    }
  };

  // ------- DATA (INITIALIZED EMPTY — API WILL FILL) -------
 userTypeChart: ChartConfiguration<'pie'>['data'] = {
  labels: [],
  datasets: []
};

requestTypeChart: ChartConfiguration<'pie'>['data'] = {
  labels: [],
  datasets: []
};

rideTypeChart: ChartConfiguration<'pie'>['data'] = {
  labels: [],
  datasets: []
};

completedChart: ChartConfiguration<'line'>['data'] = {
  labels: [],
  datasets: []
};


  ngOnInit() {
    this.loadCharts();
  }

  // ------- FETCH DATA FROM API -------
  loadCharts() {
    this.dashboardService.getDashboardStats().subscribe(data => {

      // USER TYPE CHART
      this.userTypeChart = {
        labels: data.userTypes.labels,
        datasets: [{
          data: data.userTypes.values,
          backgroundColor: ['#1976d2', '#42a5f5', '#90caf9']
        }] 
      };

      // REQUEST TYPE
      this.requestTypeChart = {
        labels: data.requestTypes.labels,
        datasets: [{
          data: data.requestTypes.values,
          backgroundColor: ['#ffa000', '#ffca28', '#ffecb3']
        }]
      };

      // RIDE TYPES
      this.rideTypeChart = {
        labels: data.rideTypes.labels,
        datasets: [{
          data: data.rideTypes.values,
          backgroundColor: ['#66bb6a', '#81c784', '#a5d6a7']
        }]
      };

      // COMPLETED REQUESTS
      this.completedChart = {
        labels: data.completed.labels,
        datasets: [{
          label: 'Completed',
          data: data.completed.values,
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25,118,210,0.2)',
          tension: 0.4
        }]
      };

    });
  }
}
