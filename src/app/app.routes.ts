import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './auth-guard';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { UsersComponent } from './pages/user/user-list/user';
import { UserFormComponent } from './pages/user/user-form/create-edit';
import { BpForm } from './pages/bp/bp-form/bp-form/bp-form';
import { BusinessPartnerListComponent } from './pages/bp/bp-list/bp-list';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
export const routes: Routes = [
      { path: '', component: LoginComponent },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
     {
          path: 'dashboard', canActivate: [authGuard], component: MainLayoutComponent,
          children: [
               { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
               // { path: 'invoice',
               //       children: [
               //           { path: '', loadComponent: () => import('./pages/invoice/invoice-list/invoice-list').then(m => m.InvoiceList) },
               //           // { path: 'create', component: InvoiceView },
               //           { path: 'edit/:id', component: UserFormComponent }
               //      ]
               // },
               // {
               //      path: 'users',
               //      children: [
               //           { path: '', component: UsersComponent },
               //           { path: 'create', component: UserFormComponent },
               //           { path: 'edit/:id', component: UserFormComponent }
               //      ]
               // },
               // {
                    
               //      path: 'bp',
               //      children: [
               //           { path: '', component: BusinessPartnerListComponent },
               //           { path: 'create', component: BpForm },
               //           { path: 'edit/:id', component: BpForm }
               //      ]
               // },
               { path: '', redirectTo: 'home', pathMatch: 'full' }

          ]
     }
];
