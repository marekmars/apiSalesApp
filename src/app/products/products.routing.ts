import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { LayoutComponent } from '../layout/layout.component';
import { ProductsDetailComponent } from './pages/products-detail/products-detail.component';

export const productsRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: ProductsListComponent },
      { path: 'detail/:id', component: ProductsDetailComponent },
      { path: 'add', component: ProductsDetailComponent },
    ]
  },
];


