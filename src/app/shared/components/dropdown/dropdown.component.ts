import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, viewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';

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
  @Output() public selectedValueChange = new EventEmitter<any>();

  public selectedValue: any;
  constructor() {

  }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    initFlowbite();
    setTimeout(() => {
      this.selectedValue = this.dropdownValues[0];
    });
  }
  selectValue(value: any) {
    this.selectedValue = value;
    console.log('selectValue ', value);
    this.selectedValueChange.emit(value);

  }

  generateID(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }
}
