import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { AppComponent } from '../app.component';

export const authRoutes: Routes = [
  {
    component: AppComponent,
    path: '',
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
];


