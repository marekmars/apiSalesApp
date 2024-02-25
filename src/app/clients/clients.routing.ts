import { Routes } from '@angular/router';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { LayoutComponent } from '../layout/layout.component';


export const clientsRoutes: Routes = [{
  component: LayoutComponent,
  path: '',
  children: [{ path: '', component: ClientListComponent }]
}
];
