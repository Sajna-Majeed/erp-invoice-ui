import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private url = 'Users';

  constructor(private api: ApiService) { }
 
  checkNameExists(name: string, id?: number) {
    return this.api.get(`${this.url}/check`, {
      name: name,
      id: id
    });
  }
  getUsers() {
    return this.api.get(this.url);
  }
  toggleStatus(moduleId: number) {
    return this.api.delete(`${this.url}/toggle/${moduleId}`);
  }
  register(user: any) {
    return this.api.post(this.url, user);
  }
  update(user: any) {
    return this.api.put(this.url, user);
  }
  delete(userId: number) {
    return this.api.delete(`${this.url}/${userId}`);
  }
}
