import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { LayoutComponent } from '../layout/layout.component';

export const productsRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: ProductsListComponent }
    ]
  },
];


