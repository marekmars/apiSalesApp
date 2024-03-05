import { Component } from '@angular/core';
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  imports: [TableComponent]
})
export class ProductsListComponent {

}
