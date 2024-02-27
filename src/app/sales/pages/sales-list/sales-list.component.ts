import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
  imports: [TableComponent]
})
export class SalesListComponent {

}
