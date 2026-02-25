import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { ThemeService } from '../../core/service/theme-services/theme';
import { AuthService } from '../../core/service/api-services/auth/auth';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
@Component({
  selector: 'app-main-layout',
  imports: [SHARED_IMPORTS],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {

  isMobile = false;
currentRoute = '';


  constructor(
    private breakpointObserver: BreakpointObserver,
    public themeService: ThemeService,
    private auth: AuthService,
    private router: Router
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
ngOnInit() {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      this.currentRoute = this.router.url.replace('/', '').toUpperCase();
    }
  });
}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

