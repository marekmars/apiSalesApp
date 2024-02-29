import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PaginatorService } from './services/paginator.service';
import { LayoutComponent } from '../../../layout/layout.component';



@Component({
  selector: 'shared-paginator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {
  private _paginatorService: PaginatorService = inject(PaginatorService);

  @Input() public totalItems: number = 0;
  @Input() public rowsPerPageOptions: number[] = [];

  private _currentPageSubscription!: Subscription

  public isDropdownOpen: boolean = false;
  public itemsPerPage: number = 0;
  public currentPage: number = 1;
  public pageRange: number[] = [1, 2, 3, 4, 5]
  public itemsXPageForms!: FormGroup;
  // @Output() public currentPageEmiter = new EventEmitter<number>();
  // @Output() public itemsPerPageEmiter = new EventEmitter<number>();

  // @Output() public itemsPerPageEmiter = new EventEmitter<number>();



  constructor() {

  }

  ngOnInit(): void {
    initFlowbite();
    this.itemsPerPage = this.rowsPerPageOptions[0];

    this.itemsXPageForms = new FormGroup({
      itemsXPage: new FormControl(this.itemsPerPage),
    })
    this._currentPageSubscription = this._paginatorService.currentPage$.subscribe(
      (page) => {
        this.currentPage = page
      }
    );
    // this._paginatorService.setPageSelector(this.itemsPerPage);
    // this.itemsPerPageEmiter.emit(this.itemsPerPage);
  }


  navigateToNextPage() {
    let pageNumber = this.currentPage + 1;

    if (pageNumber > this.maxPages) {
      return;
    }
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);
    this.currentPage = pageNumber;
    this._paginatorService.setCurrentPage(this.currentPage);
    // this.currentPageEmiter.emit(this.currentPage);

  }
  navigateToPreviousPage() {
    let pageNumber = this.currentPage - 1;
    if (pageNumber < 1) {
      return;
    }
    const newPageRange = Array.from({ length: 5 }, (_, i) => pageNumber - i).reverse();
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);
    this.currentPage = pageNumber;
    this._paginatorService.setCurrentPage(this.currentPage);
    // this.currentPageEmiter.emit(this.currentPage);
  }

  navigateToFirstPage() {
    this.currentPage = 1
    this._paginatorService.setCurrentPage(this.currentPage);
    // this.currentPageEmiter.emit(this.currentPage);
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

  }

  navigateToLastPage() {
    this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage)
    this._paginatorService.setCurrentPage(this.currentPage);
    // this.currentPageEmiter.emit(this.currentPage);
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

  }

  navigateToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this._paginatorService.setCurrentPage(this.currentPage);
    // this.currentPageEmiter.emit(this.currentPage);
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

  get maxPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.maxPages }, (_, i) => i + 1);
  }

  setItemsPerPage() {
    this.currentPage = 1;
    // this._paginatorService.setCurrentPage(this.currentPage);
    // this.currentPageEmiter.emit(this.currentPage);
    this.itemsPerPage = this.itemsXPageForms.value.itemsXPage;
    this._paginatorService.setPageSelector(this.itemsPerPage);
    this.pageRange = [1, 2, 3, 4, 5]
    // this.itemsPerPageEmiter.emit(this.itemsPerPage);

  }
}
