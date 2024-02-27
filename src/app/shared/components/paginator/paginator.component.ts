import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'shared-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  public isDropdownOpen: boolean = false;
  public itemsPerPage: number = 0;
  public currentPage: number = 1;
  public pageRange: number[] = [1, 2, 3, 4, 5]
  @Output() public currentPageEmiter = new EventEmitter<number>();
  @Output() public itemsPerPageEmiter = new EventEmitter<number>();
  @Input() public totalItems: number = 0;
  @Input() public rowsPerPageOptions: number[] = [];
  @ViewChild('dropdown') dropdown!: ElementRef;
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    // Comprueba si el evento de clic se originó en el botón del desplegable
    if (this.isDropdownOpen && event.target !== document.getElementById('dropdownDefaultButton')) {
      this.isDropdownOpen = false;
    }
  }

  constructor() {

  }

  ngOnInit(): void {

    initFlowbite();
    this.itemsPerPage = this.rowsPerPageOptions[0];
    this.itemsPerPageEmiter.emit(this.itemsPerPage);
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;


    const dropdownRect = this.dropdown.nativeElement.getBoundingClientRect();
    console.log(dropdownRect)
    const distanceToBottom = window.innerHeight - dropdownRect.bottom;
    console.log(distanceToBottom)
    if (distanceToBottom < dropdownRect.height) {
      // Si es así, añade una clase CSS para hacer que se abra hacia arriba
      this.dropdown.nativeElement.classList.add('dropdown-up');
    } else {
      this.dropdown.nativeElement.classList.remove('dropdown-up');
    }
  }

  selectItemsPerPage(items: number) {
    this.itemsPerPage = items;
    this.itemsPerPageEmiter.emit(this.itemsPerPage);
    this.isDropdownOpen = false;
  }
  navigateToNextPage() {
    let pageNumber = this.currentPage + 1;

    if (pageNumber > this.maxPages) {
      return;
    }

    this.currentPage = pageNumber;

    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

    this.currentPageEmiter.emit(this.currentPage);
  }


  navigateToPreviousPage() {
    let pageNumber = this.currentPage - 1;

    if (pageNumber < 1) {
      return;
    }

    const newPageRange = Array.from({ length: 5 }, (_, i) => pageNumber - i).reverse();
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

    this.currentPage = pageNumber;
    this.currentPageEmiter.emit(this.currentPage);
  }

  navigateToFirstPage() {
    this.currentPage = 1
    this.currentPageEmiter.emit(this.currentPage);
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

  }

  navigateToLastPage() {
    this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage)
    this.currentPageEmiter.emit(this.currentPage);
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

  }

  navigateToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.currentPageEmiter.emit(this.currentPage);
    if (pageNumber - 1 === this.pageRange[0] || pageNumber + 1 === this.pageRange[4]) {

      return;
    }
    if (pageNumber > this.pageRange[2]) {
      const newPageRange = Array.from({ length: 5 }, (_, i) => pageNumber + i);
      this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

    } else if (pageNumber < this.pageRange[2]) {
      const newPageRange = Array.from({ length: 5 }, (_, i) => pageNumber - i).reverse();
      this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

    }
  }


  ensureValidPageRange(pageRange: number[], maxPages: number) {
    const firstPage = pageRange[0];
    const lastPage = pageRange[pageRange.length - 1];
    if (firstPage < 1) {
      // Adjust if the first page is less than 1
      return Array.from({ length: 5 }, (_, i) => 1 + i);
    } else if (lastPage > maxPages) {
      // Adjust if the last page is greater than the maximum allowed
      return Array.from({ length: 5 }, (_, i) => maxPages - i).reverse();
    }

    return pageRange;
  }

  private get maxPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.maxPages }, (_, i) => i + 1);
  }
}
