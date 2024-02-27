import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  standalone: true,
  imports: [TableComponent]
})
export class ClientListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    initFlowbite();
  }

}
