import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = 'category';
  constructor(private api: ApiService) { }
  checkNameExists(name: string, id?: number) {
    return this.api.get(`${this.url}/check`, {
      name: name,
      id: id
    });
  }

  getAll() {
    return this.api.get(this.url);
  }
  getNextNumber() {
    return this.api.get(`${this.url}/code`);
  }
  getById(id: number) {
    return this.api.get(`${this.url}/${id}`);
  }
  create(product: any) {
    return this.api.post(this.url, product);
  }
  update(product: any) {
    return this.api.put(this.url, product);
  }
  delete(productId: number) {
    return this.api.delete(`${this.url}/${productId}`);
  }
  toggleStatus(productId: number) {
    return this.api.delete(`${this.url}/toggle/${productId}`);
  }
}
