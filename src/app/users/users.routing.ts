import { Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { LayoutComponent } from '../layout/layout.component';
import { UsersDetailComponent } from './pages/users-detail/users-detail.component';

export const usersRoutes: Routes = [
  {
    component: LayoutComponent,
    path: '',
    children: [
      { path: '', component: UsersListComponent },
      { path: 'add', component: UsersDetailComponent },
      { path: 'detail/:id', component: UsersDetailComponent },
      { path: 'profile', component: UsersDetailComponent },
      { path: '**', redirectTo: '' }
    ]
  },
];

