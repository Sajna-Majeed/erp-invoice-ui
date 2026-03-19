import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guard/auth-guard';
import { LoginComponent } from './features/authentication/login/login';
import { UserListComponent } from './features/settings/user/user-list/user';
import { UserFormComponent } from './features/settings/user/user-form/create-edit';
import { ProductComponent } from './features/masters/product/product';
import { ServiceTypeComponent } from './features/masters/service-type/service-type';
import { CustomerTypeComponent } from './features/masters/customer-type/customer-type';
import { CustomerComponent } from './features/masters/customer/customer';
import { CustompriceComponent } from './features/masters/custom-price/custom-price';
import { ModuleComponent } from './features/masters/module/module';
import { QuoteFormComponent } from './features/transaction/quotes/quote-form/quote-form';
import { QuoteListComponent } from './features/transaction/quotes/quote-list/quote-list';
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

               { path: 'quote',
                     children: [
                         { path: '', component:QuoteListComponent },
                          { path: 'create', component: QuoteFormComponent },
                         { path: 'edit/:id', component: QuoteFormComponent },
                         { path: 'view/:id', component: QuoteFormComponent }
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
                    path: 'custom-price',
                    children: [
                         { path: '', component: CustompriceComponent }
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
