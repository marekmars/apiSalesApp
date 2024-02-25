import { Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { LayoutComponent } from '../layout/layout.component';

export const usersRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: UsersListComponent }
    ]
  },
];

