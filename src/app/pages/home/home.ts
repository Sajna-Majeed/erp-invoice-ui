import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Charts } from '../home/charts/charts';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  totalUsers = 0;
  pendingRequests = 0;
  pendingActivation = 0;
  rideCount = 0;

  constructor() {
    //this.loadDashboardStats();
  }

  loadDashboardStats() {
    // Temporary static data — will be replaced by API calls
    this.totalUsers = 52;
    this.pendingRequests = 8;
    this.pendingActivation = 4;
    this.rideCount = 123;
  }
}
