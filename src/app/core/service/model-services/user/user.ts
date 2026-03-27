import { Injectable } from '@angular/core';
import { UserInfo } from '../../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserInfo | null = null;
  private company: any | null = null;
  menu: any[] = [];
  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }


  setUser(user: any | null) {
    this.clearUser();
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): UserInfo | null {
    if (!this.user) {
      const savedUser = localStorage.getItem('user');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    }
    return this.user;
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }

  setCompany(company: any) {
    this.clearCompany();
    this.company = company;
    localStorage.setItem('company', JSON.stringify(company));
  }

  getCompany(): any | null {
    if (!this.company) {
      const savedCompany = localStorage.getItem('company');
      this.company = savedCompany ? JSON.parse(savedCompany) : null;
    }
    return this.company.company;
  }

  clearCompany() {
    this.company = null;
    localStorage.removeItem('company');
  }



  setMenu(menu: any) {
    this.clearMenu();
    this.menu = menu;
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  getMenu(): any | null {
    if (!this.menu || this.menu.length == 0) {
      const savedMenu = localStorage.getItem('menu');
      this.menu = savedMenu ? JSON.parse(savedMenu) : null;
    }
    return this.menu;
  }

  clearMenu() {
    this.company = null;
    localStorage.removeItem('menu');
  }



  getUsername(): string {
    return this.user?.user_Name || '';
  }

  getUserRole(): string {
    return this.user?.role || '';
  }

  getEmail(): string {
    return this.user?.name || '';
  }
}
export type { UserInfo };

