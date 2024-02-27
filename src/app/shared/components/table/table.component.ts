import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PaginatorComponent } from "../paginator/paginator.component";

const items: any[] = [
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
  {
    id: '1001',
    code: 'a123bc4d5',
    name: 'Leather Wallet',
    description: 'Premium leather wallet',
    price: 45,
    category: 'Accessories',
    quantity: 15,
    inventoryStatus: 'INSTOCK',
    rating: 4
  },
  {
    id: '1002',
    code: 'b456de7f8',
    name: 'Smartphone Holder',
    description: 'Adjustable smartphone holder',
    price: 15,
    category: 'Electronics',
    quantity: 50,
    inventoryStatus: 'INSTOCK',
    rating: 4.2
  },
  {
    id: '1003',
    code: 'c789gh1i2',
    name: 'Vintage Backpack',
    description: 'Classic vintage backpack',
    price: 80,
    category: 'Fashion',
    quantity: 10,
    inventoryStatus: 'INSTOCK',
    rating: 4.7
  },
  {
    id: '1004',
    code: 'd321jk5l6',
    name: 'Wireless Earbuds',
    description: 'Bluetooth wireless earbuds',
    price: 40,
    category: 'Electronics',
    quantity: 30,
    inventoryStatus: 'INSTOCK',
    rating: 4.5
  },
  {
    id: '1005',
    code: 'e654mn8o9',
    name: 'Sports Watch',
    description: 'Water-resistant sports watch',
    price: 55,
    category: 'Accessories',
    quantity: 20,
    inventoryStatus: 'INSTOCK',
    rating: 4.8
  },
  {
    id: '1006',
    code: 'g098pq3r4',
    name: 'Gaming Mouse',
    description: 'High-performance gaming mouse',
    price: 35,
    category: 'Electronics',
    quantity: 25,
    inventoryStatus: 'INSTOCK',
    rating: 4.4
  },
  {
    id: '1007',
    code: 'h567tu2v3',
    name: 'Travel Backpack',
    description: 'Spacious travel backpack',
    price: 75,
    category: 'Fashion',
    quantity: 15,
    inventoryStatus: 'INSTOCK',
    rating: 4.6
  },
  {
    id: '1008',
    code: 'i345wx6y7',
    name: 'Portable Charger',
    description: 'Compact portable charger',
    price: 25,
    category: 'Electronics',
    quantity: 40,
    inventoryStatus: 'INSTOCK',
    rating: 4.2
  },
  {
    id: '1009',
    code: 'j901ab2c3',
    name: 'Stylish Sunglasses',
    description: 'Trendy and stylish sunglasses',
    price: 50,
    category: 'Accessories',
    quantity: 18,
    inventoryStatus: 'INSTOCK',
    rating: 4.9
  },
  {
    id: '1010',
    code: 'z987yxw654',
    name: 'Metallic Sunglasses',
    description: 'Reflective sunglasses',
    price: 30,
    category: 'Accessories',
    quantity: 20,
    inventoryStatus: 'INSTOCK',
    rating: 4.5
  }
]


@Component({
  selector: 'shared-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports: [CommonModule, RouterLinkActive, PaginatorComponent]
})

export class TableComponent implements OnInit {


  @Input() public tableItems: any[] = items;
  public headers: string[] = [];
  @Input() itemsPerPage: number = 5;
  @Input() public currentPage: number = 1;

  public items: number = 0;
  ngOnInit(): void {
    initFlowbite();
    this.headers = this.getHeaders();
    this.getValues();

    console.log(this.items);
  }
  getHeaders(): string[] {
    if (!this.tableItems[0]) return [];
    const headers: any[] = [];
    for (const key in this.tableItems[0]) {
      headers.push(key);
    }
    return headers;
  }

  getValues(): any[][] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const matrix: any[][] = [];
    const items = Object.values(this.tableItems).slice(start, end);
    for (const value of items) {
      const row: any[] = Object.values(value);
      matrix.push(row);
    }

    return matrix;
  }


  onPageSelectorChange(itemsPage: number) {

    this.itemsPerPage = itemsPage;
    // Aquí puedes llamar a getValues() para actualizar los datos de la tabla
  }
  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex
  }

  openDeleteModal(id: number) {
    
  }

}
