import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent, MatSidenavContainer } from '@angular/material/sidenav';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/api-services/auth/auth';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SHARED_IMPORTS, MatSidenavContent, MatSidenavContainer, MatSidenav,MatListModule,MatToolbarModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
@ViewChild(MatSidenav) sidenav!: MatSidenav;
router = inject(Router);
auth = inject(AuthService);



  isMobile = false;
ngAfterViewInit() {
  setTimeout(() => this.checkScreen(), 50);
}
  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 900;
    if (this.isMobile && this.sidenav) this.sidenav.close();
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }  
  
  logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}
}
