import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { ThemeService } from '../../core/service/theme-services/theme';
import { AuthService } from '../../core/service/api-services/auth/auth';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { UserInfo } from '../../models/interface/user';
import { UserService } from '../../core/service/model-services/user/user';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-main-layout',
  imports: [SHARED_IMPORTS],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  animations: [
  trigger('fadeAnimation', [
    transition('* <=> *', [
      style({ opacity: 0 }),
      animate('200ms ease-in', style({ opacity: 1 }))
    ])
  ])
]
})
export class MainLayoutComponent {

  isMobile = false;
currentRoute = '';
isCollapsed = false;
 user: UserInfo | null = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public themeService: ThemeService,
    private auth: AuthService,
    private userService: UserService,
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
      const segments = this.router.url.split('/').filter(Boolean);
      this.currentRoute = segments[0]
        ? segments[0].replace('-', ' ')
        : 'Dashboard';
    }
  });
   this.user = this.userService.getUser();
}


toggleSidebar() {
  this.isCollapsed = !this.isCollapsed;
}
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

