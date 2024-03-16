import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../auth/services/auth.service';
import { MenuItem } from '../../../shared/interfaces/menu-item.interfaces';
import { UserService } from '../../../users/services/user.service';
import { User } from '../../../users/interfaces/user.interfaces';
import { Subscription } from 'rxjs';

const menuAdmin = [
  {
    label: 'Home',
    icon: '/assets/home.svg',
    path: '/home'
  },
  {
    label: 'Sales',
    icon: '/assets/sales.svg',
    path: '/sales'
  },
  {
    label: 'Clients',
    icon: '/assets/clients.svg',
    path: '/clients'
  },
  {
    label: 'Products',
    icon: '/assets/products.svg',
    path: '/products'
  },
  {
    label: 'Users',
    icon: '/assets/users.svg',
    path: '/users'
  }
]
const menuSeller = [
  {
    label: 'Home',
    icon: '/assets/home.svg',
    path: '/home'
  },
  {
    label: 'Sales',
    icon: '/assets/sales.svg',
    path: '/sales'
  },
  {
    label: 'Clients',
    icon: '/assets/clients.svg',
    path: '/clients'
  },
  {
    label: 'Products',
    icon: '/assets/products.svg',
    path: '/products'
  },
]

@Component({
  selector: 'layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class SidenavComponent {


  @ViewChild('toggleSidebarButton') toggleSidebarButton: ElementRef | undefined;
  // private _userService: UserService = inject(UserService);
  private _authService: AuthService = inject(AuthService);
  public currentUser: User | null = null;
  public isMobile: boolean = false;
  public menuItems: MenuItem[] = []

  user: User | null = null
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  ngOnInit() {
    this.checkIfMobile();
    initFlowbite();
    // const userToken = localStorage.getItem('token')!;
    this._authService.userObservable.subscribe((user) => {
      this.currentUser = user;
      if (this.currentUser?.role?.name === 'Admin') {
        this.menuItems = menuAdmin
      } else {
        this.menuItems = menuSeller
      }
    })
    // this._userService.getCurrentUser(userToken).subscribe(res => {
    //   this.user = res.data[0];
    //   if (this.user.role?.name === 'Admin') {
    //     this.menuItems = menuAdmin
    //   } else {
    //     this.menuItems = menuSeller
    //   }
    // })

  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  activateButton() {
    if (this.isMobile && this.toggleSidebarButton) {
      this.toggleSidebarButton.nativeElement.click();
    }
  }


}


