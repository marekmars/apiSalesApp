import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { NavComponent } from "./components/nav/nav.component";

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    imports: [RouterOutlet, SidenavComponent, NavComponent]
})


export class LayoutComponent {

}

