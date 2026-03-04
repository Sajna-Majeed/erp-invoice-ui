import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private storageKey = 'app-theme';
  private darkClass = 'dark-mode';   // 👈 must match Prime config

  constructor() {
    this.init();
  }

  init(): void {
    const saved = localStorage.getItem(this.storageKey);

    if (saved === 'dark') {
      this.enableDark();
    } else {
      this.disableDark();
    }
  }

  toggle(): void {
    if (this.isDark()) {
      this.disableDark();
    } else {
      this.enableDark();
    }
  }

  enableDark(): void {
    document.body.classList.add(this.darkClass);
    document.documentElement.style.colorScheme = 'dark';
    localStorage.setItem(this.storageKey, 'dark');
  }

  disableDark(): void {
    document.body.classList.remove(this.darkClass);
    document.documentElement.style.colorScheme = 'light';
    localStorage.setItem(this.storageKey, 'light');
  }

  isDark(): boolean {
    return document.body.classList.contains(this.darkClass);
  }
}