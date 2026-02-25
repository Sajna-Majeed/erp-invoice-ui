import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private darkClass = 'dark-theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    document.documentElement.classList.toggle(this.darkClass);

    const isDark =
      document.documentElement.classList.contains(this.darkClass);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    document.body.style.colorScheme = isDark ? 'dark' : 'light';
  }

  loadTheme() {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
      document.documentElement.classList.add(this.darkClass);
      document.body.style.colorScheme = 'dark';
    }
  }

  isDark(): boolean {
    return document.documentElement.classList.contains(this.darkClass);
  }
}