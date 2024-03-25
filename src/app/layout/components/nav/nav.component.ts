import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserService } from '../../../users/services/user.service';
import { User } from '../../../users/interfaces/user.interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { MenuItem } from '../../../shared/interfaces/menu-item.interfaces';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'layout-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  private _userService: UserService = inject(UserService);
  public currentUser: User | null = null;
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  public menuItems: MenuItem[] = []
  public avatar: string = '/assets/defaultAvatar.svg'
  public defaultAvatar: string = '/assets/defaultAvatar.svg'
  constructor() {
    initFlowbite();
    this._authService.userObservable.subscribe((user) => {
      this.currentUser = user;
      this.avatar = this.currentUser?.avatar?.url ?? this.defaultAvatar;
    })
    // if (!localStorage.getItem('token')) this.user = null;

    // const token = localStorage.getItem('token');
    // if (token) {
    //   // this._userService.getUserTokenInfo(token).subscribe(res => {

    //   //   this.avatar = this.user?.avatar?.url ?? this.defaultAvatar;
    //   //   console.log(res);
    //   // })
    //   this._userService.getCurrentUser(token).subscribe(res => {
    //     this.user = res.data[0];

    //     this.avatar = this.user?.avatar?.url ?? this.defaultAvatar;
    //   })

    // }
    this.menuItems = [
      {
        label: 'Profile',
        icon: '',
        path: '/users/profile'
      }
    ]

  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/auth/login');
  }
}
