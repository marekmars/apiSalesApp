import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-404-page',
  templateUrl: './404-page.component.html',
  styleUrls: ['./404-page.component.css'],
  standalone: true,
  imports: [CommonModule,RouterLink],
})
export class NotFoundPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
