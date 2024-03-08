import { Routes } from '@angular/router';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { LayoutComponent } from '../layout/layout.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';


export const clientsRoutes: Routes = [{
  component: LayoutComponent,
  path: '',
  children: [
    { path: '', component: ClientListComponent },
    { path: 'detail/:id', component: ClientDetailComponent },
    { path: 'add', component: ClientDetailComponent },
  ]
}
];
