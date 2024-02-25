import { Routes } from '@angular/router';
import { SalesListComponent } from './pages/sales-list/sales-list.component';
import { LayoutComponent } from '../layout/layout.component';

export const salesRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: SalesListComponent }
    ]
  },
];


