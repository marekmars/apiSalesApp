import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../auth/services/auth.service';
import { MenuItem } from '../../../shared/interfaces/menu-item.interfaces';
@Component({
  selector: 'layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class SidenavComponent {


  @ViewChild('toggleSidebarButton') toggleSidebarButton: ElementRef | undefined;

  public isMobile: boolean = false;
  public menuItems: MenuItem[] = [ ]
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfMobile();
  }

  ngOnInit() {
    this.checkIfMobile();
    initFlowbite();

    this.menuItems = [
      {
        label:'Home',
        icon:'/assets/home.svg',
        path: '/home'
      },
      {
        label:'Sales',
        icon:'/assets/sales.svg',
        path: '/sales'
      },
      {
        label:'Clients',
        icon:'/assets/clients.svg',
        path: '/clients'
      },
      {
        label:'Products',
        icon:'/assets/products.svg',
        path: '/products'
      },

      {
        label:'Users',
        icon:'/assets/users.svg',
        path: '/users'
      }
    ]
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


