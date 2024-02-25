import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

export const dashboardRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: HomeComponent }
    ]
  },
];


