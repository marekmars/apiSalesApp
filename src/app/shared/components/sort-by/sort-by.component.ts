import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { SortBy, SortByEnum } from '../../interfaces/sort-by.interface';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { LayoutComponent } from '../../../layout/layout.component';
import { SortByService } from './services/sort-by.service';

@Component({
  selector: 'shared-sort-by',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-by.component.html',

})
export class SortByComponent {

  constructor() {
    initFlowbite();
  }
  private _sortByService: SortByService = inject(SortByService);
  @Input() public sortBy: SortBy = {
    sort: SortByEnum.id,
    desc: 0
  };
  public selectedSort: SortByEnum = this.sortBy.sort;
  // Define el conjunto de valores permitidos
  public allowedValues = [SortByEnum.id, SortByEnum.lastname, SortByEnum.date, SortByEnum.total];

  // Filtra las claves del enum basándote en el conjunto de valores permitidos
  public sortValues: { key: string, value: string }[] = Object.entries(SortByEnum)
    .filter(([key, value]) => this.allowedValues.includes(value))
    .map(([key, value]) => ({ key, value }));

  selectItem(value: string) {
    console.log("value ", value);
    this.sortBy.sort = SortByEnum[value as keyof typeof SortByEnum];
    console.log("this.sortBy.sort ", this.sortBy.sort);
    this._sortByService.setCurrentPage(this.sortBy);
    this.selectedSort = SortByEnum[value as keyof typeof SortByEnum];

  }
  onDescChange(checkbox: any) {
    this.sortBy.desc = checkbox.target.checked ? 1 : 0
    this._sortByService.setCurrentPage(this.sortBy);
  }


}
