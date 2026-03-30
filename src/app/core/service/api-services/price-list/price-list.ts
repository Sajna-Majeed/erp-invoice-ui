import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({ providedIn: 'root' })
export class PriceListApiService {

  private url = `pricelist`;

  constructor(private api: ApiService) { }
  getAll() {
    return this.api.get(this.url);
  }

  create(data: any) {
    return this.api.post(this.url, data);
  }

  update(data: any) {
    return this.api.put(`${this.url}`, data);
  }

  delete(id: number) {
    return this.api.delete(`${this.url}/${id}`);
  }
  toggleStatus(id: number) {
    return this.api.delete(`${this.url}/toggle/${id}`);
  }

  getByFilter(pd_id: number, customer_id: number, st_id: number, module_id: number) {
    return this.api.get(`${this.url}/filtered?pd_id=${pd_id}&customer_id=${customer_id}&st_id=${st_id}&module_id=${module_id}`);
  }
}