import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../core/service/theme-services/theme';
import { AuthService } from '../../core/service/api-services/auth/auth';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { UserInfo, UserService } from '../../core/service/model-services/user/user';


@Component({
  selector: 'app-main-layout',
  imports: [SHARED_IMPORTS],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent {
  menuItems: any[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Master',
      icon: 'pi pi-folder',
      items: [
        { label: 'Services Types', icon: 'pi pi-cog', routerLink: '/serviceType' },
        { label: 'Customer Types', icon: 'pi pi-users', routerLink: '/customerType' },
        { label: 'Customer', icon: 'pi pi-briefcase', routerLink: '/customer' },
        { label: 'Products', icon: 'pi pi-box', routerLink: '/product' },
        { label: 'Modules', icon: 'pi pi-th-large', routerLink: '/module' },
        { label: 'Custom Price', icon: 'pi pi-money', routerLink: '/custom-price' }
      ]
    },
    {
      label: 'Transactions',
      icon: 'pi pi-refresh',
      items: [
        { label: 'Quotes', icon: 'pi pi-file', routerLink: '/quote' }
      ]
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        { label: 'Users', icon: 'pi pi-users', routerLink: '/users' }
      ],
      // visible: this.user?.userRole === 'Admin'
    }
  ];
  isMobile = false;
  currentRoute = '';
  isCollapsed = false;
  user: UserInfo | null = null;
  mobileMenu = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    public themeService: ThemeService,
    private userService: UserService,
    private router: Router
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
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
    this.loadMenu();


  }
  loadMenu() {
    this.menuItems = this.userService.getMenu()
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
      .map((menu: any) => {

        const items = (menu.menuItems || [])
          .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
          .map((item: any) => ({
            label: item.name,
            icon: item.icon,
            routerLink: item.link,
            routerLinkActiveOptions: { exact: true },
            styleClass: this.isActive(item.link) ? 'active-menu' : ''
          }));
        if (items.length > 0) {
          return {
            label: menu.name,
            icon: menu.icon,
            routerLink: menu.link,
            items: items
          };
        }
        else{
           return {
            label: menu.name,
            icon: menu.icon,
            routerLink: menu.link,
           }
        }
      });
      console.log(this.menuItems);
  }
  mobileSidebar = false;


  userItems = [
    {
      label: 'Profile',
      icon: 'pi pi-user'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

