
import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({ providedIn: 'root' })
export class QuoteApiService {

  private url = `quote`;

  constructor(private api: ApiService) { }

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

  update(data: any) {
    return this.api.put(`${this.url}`, data);
  }
  upload(data: any) {
    return this.api.post(`${this.url}/upload`, data);
  }
  delete(id: number) {
    return this.api.delete(`${this.url}/${id}`);
  }
  toggleStatus(id: number) {
    return this.api.delete(`${this.url}/toggle/${id}`);
  }
  deleteFile(id: number) {
    return this.api.delete(`${this.url}/delete-multiple/${id}`);
  }

  deleteMultiple(ids: number[]) {
    return this.api.post(`${this.url}/delete-multiple`, ids);
  }
  createWithFiles(data: FormData) {
  return this.api.post(`${this.url}`, data);
}

updateWithFiles(data: FormData) {
  return this.api.put(`${this.url}`, data);
}
}