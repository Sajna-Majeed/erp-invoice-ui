import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../shared/enviorment';

@Injectable({ providedIn: 'root' })
export class BussinessPointApiService {

  private baseUrl = `${environment.apiUrl}/bussinessPartner`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}