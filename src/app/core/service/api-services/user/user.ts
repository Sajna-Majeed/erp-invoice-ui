import { Injectable } from '@angular/core';
import { User } from '../../../../models/interface/user';
import { ApiService } from '../api-service';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
   private url = 'Users';

  constructor(private api: ApiService) {}

  getUsers() {
    return this.api.get(this.url);
  }
  getUserById(id: number) {
    return this.api.get(`${this.url}/${id}`);
  }
  register(user: User) {
    return this.api.post(this.url, user);
  }
  update(user: User) {
    return this.api.put(this.url, user);
  }
  delete(userId: number) {  
    return this.api.delete(`${this.url}/${userId}`); 
  }
}
