import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guard/auth-guard';
import { UserListComponent } from './pages/user/user-list/user';
import { UserFormComponent } from './pages/user/user-form/create-edit';
export const routes: Routes = [
     { path: '', component: LoginComponent },
     { path: '', redirectTo: 'login', pathMatch: 'full' },
     {
          path: '', canActivate: [authGuard], component: MainLayoutComponent,
          children: [
               { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
               {
                    path: 'users',
                    children: [
                         { path: '', component: UserListComponent },
                         { path: 'create', component: UserFormComponent },
                         { path: 'edit/:id', component: UserFormComponent }
                    ]
               },






               // { path: 'invoice',
               //       children: [
               //           { path: '', loadComponent: () => import('./pages/invoice/invoice-list/invoice-list').then(m => m.InvoiceList) },
               //           // { path: 'create', component: InvoiceView },
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
