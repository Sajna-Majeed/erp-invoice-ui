
import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({ providedIn: 'root' })
export class QuoteApiService {

  private url = `quote`;

 constructor(private api: ApiService) {}

  getAll() {
    return this.api.get(this.url);
  }
getNextNumber() {
     return this.api.get(`${this.url}/quotenumber`);
  }
  getById(id: number) {
    return this.api.get(`${this.url}/${id}`);
  }

  create(data: any) {
    return this.api.post(this.url, data);
  }

  update( data: any) {
    return this.api.put(`${this.url}`, data);
  }

  delete(id: number) {
    return this.api.delete(`${this.url}/${id}`);
  }
     toggleStatus(id: number) {
      return this.api.delete(`${this.url}/toggle/${id}`);
    }
}