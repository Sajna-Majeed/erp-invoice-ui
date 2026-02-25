import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../shared/enviorment';
import { User } from '../../../../models/interface/user';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
   private baseUrl = environment.apiUrl + '/Users';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any>(this.baseUrl);
  }
  getUserById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
  register(user: User) {
    debugger
    return this.http.post(`${this.baseUrl}`, user);
  }
  update(user: User) {
    return this.http.put(`${this.baseUrl}`, user);
  }
  delete(userId: number) {  
    return this.http.delete(`${this.baseUrl}/${userId}`); 
  }
}
