import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guard/auth-guard';
import { LoginComponent } from './features/login/login';
import { UserListComponent } from './features/user/user-list/user';
import { UserFormComponent } from './features/user/user-form/create-edit';
import { BpListComponent } from './features/bp/bp-list/bp-list';
import { BpFormComponent } from './features/bp/bp-form/bp-form/bp-form';
import { InvoiceFormComponent } from './features/invoice/invoice-form/invoice-view';
import { InvoicePrintComponent } from './features/invoice/invoice-print/invoice-print';
import { ProductComponent } from './features/product/product/product';
import { ServiceTypeComponent } from './features/service-type/service-type/service-type';
import { ModuleComponent } from './features/module/module/module';
import { CustomerTypeComponent } from './features/customer-type/customer-type';
import { CustomerComponent } from './features/customer/customer';
export const routes: Routes = [
     { path: '', component: LoginComponent },
     { path: '', redirectTo: 'login', pathMatch: 'full' },
     {
          path: '', canActivate: [authGuard], component: MainLayoutComponent,
          children: [
               { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
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
                         { path: '', loadComponent: () => import('./features/invoice/invoice-list/invoice-list').then(m => m.InvoiceListComponent) },
                          { path: 'create', component: InvoiceFormComponent },
                         { path: 'edit/:id', component: InvoiceFormComponent },
                         { path: 'view/:id', component: InvoicePrintComponent }
                    ]
               },
               {
                    path: 'product',
                    children: [
                         { path: '', component: ProductComponent }
                    ]
               },
                {
                    path: 'serviceType',
                    children: [
                         { path: '', component: ServiceTypeComponent }
                    ]
               },
               {
                    path: 'customerType',
                    children: [
                         { path: '', component: CustomerTypeComponent }
                    ]
               },
                 {
                    path: 'customer',
                    children: [
                         { path: '', component: CustomerComponent }
                    ]
               },
               {
                    path: 'module',
                    children: [
                         { path: '', component: ModuleComponent },
                    ]
               },
               { path: '', redirectTo: 'home', pathMatch: 'full' }

          ]
     }
];
