import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private api = 'http://localhost:5009/api/Coordinator/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats() {
    return this.http.get<any>(this.api);
  }
}
