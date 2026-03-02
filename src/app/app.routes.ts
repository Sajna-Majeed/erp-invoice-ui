import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guard/auth-guard';
import { UserListComponent } from './pages/user/user-list/user';
import { UserFormComponent } from './pages/user/user-form/create-edit';
import { BpFormComponent } from './pages/bp/bp-form/bp-form/bp-form';
import { BpListComponent } from './pages/bp/bp-list/bp-list';
import { InvoiceFormComponent } from './pages/invoice/invoice-form/invoice-view';
import { InvoicePrintComponent } from './pages/invoice/invoice-print/invoice-print';
import { ProductDialogComponent } from './pages/product/product-dialog/product-dialog';
import { ProductComponent } from './pages/product/product/product';
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


               {

                    path: 'bp',
                    children: [
                         { path: '', component: BpListComponent },
                         { path: 'create', component: BpFormComponent },
                         { path: 'edit/:id', component: BpFormComponent }
                    ]
               },

               { path: 'invoice',
                     children: [
                         { path: '', loadComponent: () => import('./pages/invoice/invoice-list/invoice-list').then(m => m.InvoiceListComponent) },
                          { path: 'create', component: InvoiceFormComponent },
                         { path: 'edit/:id', component: InvoiceFormComponent },
                         { path: 'view/:id', component: InvoicePrintComponent }
                    ]
               },
               {
                    path: 'product',
                    children: [
                         { path: '', component: ProductComponent },
                         { path: 'create', component: ProductDialogComponent },
                         { path: 'edit/:id', component: ProductDialogComponent }
                    ]
               },
               { path: '', redirectTo: 'home', pathMatch: 'full' }

          ]
     }
];
