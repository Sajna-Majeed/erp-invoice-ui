import { Injectable } from '@angular/core';
import { UserInfo } from '../../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserInfo | null = null;
  private company: any | null = null;
  constructor() {
    // Load saved user from localStorage on startup
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  // ✅ Save user info after login
  setUser(user: UserInfo) {
    this.clearUser(); // Clear any existing user data
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // ✅ Get current user (from memory or localStorage)
  getUser(): UserInfo | null {
    if (!this.user) {
      const savedUser = localStorage.getItem('user');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    }
    return this.user;
  }

  // ✅ Clear user info (on logout)
  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

  setCompany(company: any) {
    this.clearUser(); // Clear any existing user data
    this.company = company;
    debugger
    localStorage.setItem('company', JSON.stringify(company));
  }

  // ✅ Get current company (from memory or localStorage)
  getCompany(): any | null {
    if (!this.company) {
      const savedCompany = localStorage.getItem('company');
      this.company = savedCompany ? JSON.parse(savedCompany) : null;
    }
    return this.company.company;
  }

  // ✅ Clear company info (on logout)
  clearCompany() {
    this.company = null;
    localStorage.removeItem('company');
  }

  // ✅ Helper getters
  getUsername(): string {
    return this.user?.username || '';
  }

  getUserRole(): string {
    return this.user?.userRole || '';
  }

  getEmail(): string {
    return this.user?.fullName || '';
  }
}
export type { UserInfo };

