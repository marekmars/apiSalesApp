import { Routes } from '@angular/router';
import { SalesListComponent } from './pages/sales-list/sales-list.component';
import { LayoutComponent } from '../layout/layout.component';
import { SalesDetailComponent } from './pages/sales-detail/sales-detail.component';

export const salesRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: SalesListComponent },
      { path: 'add', component: SalesDetailComponent },
      { path: 'detail/:id', component: SalesDetailComponent },
    ]
  },
];


