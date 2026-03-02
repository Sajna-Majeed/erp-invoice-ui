import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
    private url = 'product';
  constructor(private api: ApiService) {}

  search(term: string) {
    return this.api.get(`${this.url}/search?term=${term}`);
  }

  getAll() {
    return this.api.get(this.url);
  }
  getNextNumber() {
     return this.api.get(`${this.url}/productcode`);
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
}
