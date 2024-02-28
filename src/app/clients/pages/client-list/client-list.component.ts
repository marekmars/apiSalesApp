import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SkeletonTableComponent } from '../../../shared/components/skeleton-views/components/skeleton-table/skeleton-table.component';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  standalone: true,
  imports: [SkeletonTableComponent]
})
export class ClientListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    initFlowbite();
  }

}
