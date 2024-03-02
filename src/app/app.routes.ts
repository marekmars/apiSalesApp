import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { loginGuard } from './auth/guards/login.guard';
export const routes: Routes = [
  { path: 'home', loadChildren: () => import('./dashboard/dashboard.routing').then(m => m.dashboardRoutes), canActivate: [authGuard] },
  { path: 'clients', loadChildren: () => import('./clients/clients.routing').then(m => m.clientsRoutes) , canActivate: [authGuard] },
  { path: 'sales', loadChildren: () => import('./sales/sales.routing').then(m => m.salesRoutes), canActivate: [authGuard] },
  { path: 'products', loadChildren: () => import('./products/products.routing').then(m => m.productsRoutes), canActivate: [authGuard] },
  { path: 'users', loadChildren: () => import('./users/users.routing').then(m => m.usersRoutes) , canActivate: [authGuard]},
  { path: 'auth', loadChildren: () => import('./auth/auth.routing').then(m => m.authRoutes) , canActivate: [loginGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./shared/pages/404/404-page.component').then(m => m.NotFoundPageComponent) }
];
