import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guard/auth-guard';
import { LoginComponent } from './features/authentication/login/login';
import { CategoryComponent } from './features/masters/category/category';
import { ServiceTypeComponent } from './features/masters/service-type/service-type';
import { CustomerTypeComponent } from './features/masters/customer-type/customer-type';
import { CustomerComponent } from './features/masters/customer/customer';
import { CustompriceComponent } from './features/masters/custom-price/custom-price';
import {  ProductComponent } from './features/masters/product/product';
import { QuoteFormComponent } from './features/transaction/quotes/quote-form/quote-form';
import { QuoteListComponent } from './features/transaction/quotes/quote-list/quote-list';
import { QuotePrintComponent } from './features/transaction/quotes/quote-print/quote-print';
import { UserListComponent } from './features/settings/user/user';
import { RolePermissionComponent } from './features/settings/role-permission/role-permission';
import { UserProfileComponent } from './features/authentication/user-profile/user-profile';

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
                         { path: '', component: UserListComponent }
                    ]
               },
               {
                    path: 'profile',
                    children: [
                         { path: '', component: UserProfileComponent }
                    ]
               },
               { path: 'quote',
                     children: [
                         { path: '', component:QuoteListComponent },
                          { path: 'create', component: QuoteFormComponent },
                         { path: 'edit/:id', component: QuoteFormComponent },
                         { path: 'view/:id', component: QuotePrintComponent }
                    ]
               },
               {
                    path: 'category',
                    children: [
                         { path: '', component: CategoryComponent }
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
                    path: 'custom-price',
                    children: [
                         { path: '', component: CustompriceComponent }
                    ]
               },
               {
                    path: 'product',
                    children: [
                         { path: '', component: ProductComponent },
                    ]
               },
                {
                    path: 'role',
                    children: [
                         { path: '', component: RolePermissionComponent },
                    ]
               },
               { path: '', redirectTo: 'home', pathMatch: 'full' }

          ]
     }
];
