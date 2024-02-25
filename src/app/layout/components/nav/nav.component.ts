import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../users/services/user.service';
import { User } from '../../../users/interfaces/user.iterfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { MenuItem } from '../../../shared/interfaces/menu-item.interfaces';


@Component({
  selector: 'layout-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  private _userService: UserService = inject(UserService);

  public user: User | null = null;
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  public menuItems: MenuItem[] = [ ]
  constructor() {
    initFlowbite();
    if (!localStorage.getItem('token')) this.user = null;

    const token = localStorage.getItem('token');
    if (token) {
      this._userService.getUserInfo(token).subscribe(res => {
        this.user = res.data[0]
        console.log(res);
      })
    }

    this.menuItems = [
      {
        label:'Settings',
        icon:'',
        path: '/profile'
      }
    ]

  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/auth/login');
  }
}
