import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({ providedIn: 'root' })
export class RoleApiService {

  private url = `role`;

 constructor(private api: ApiService) {}
  getAllPermission() {
    return this.api.get(`${this.url}/permissions`);
  }
  getAllRoles() {
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
  checkNameExists(name: string, id?: number) {
    return this.api.get(`${this.url}/check`, {
      name: name,
      id: id
    });
  }
}