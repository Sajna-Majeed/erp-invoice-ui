import { Injectable } from '@angular/core';
import { ApiService } from '../api-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) {}

  login(data: any) {
    return this.api.post('auth/login', data);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }
  
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }



  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}