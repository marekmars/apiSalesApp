import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, inject, viewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';

import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-dropdown',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements AfterViewInit, OnInit {
  public id: string = this.generateID();

  @Input() public dropdownValues!: any[];
  @Input() public selectedValue: any ;
  @Output() public selectedValueChange = new EventEmitter<any>();



  // public selectedValue: any;
  constructor() {

  }
  ngOnInit(): void {
    //  this.selectedValue = this.dropdownValues[0];

  }
  ngAfterViewInit(): void {
    initFlowbite();
    // setTimeout(() => {
    //   // Si hay un valor proporcionado desde el padre, úsalo como valor inicial
    //   this.selectedValue = this.value || this.dropdownValues[0];
    // });
  }
  selectValue(value: any) {
    this.selectedValue = value;

    this.selectedValueChange.emit(value);
  }

  generateID(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }


}
