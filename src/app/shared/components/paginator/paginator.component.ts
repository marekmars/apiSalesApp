import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PaginatorService } from './services/paginator.service';
import { LayoutComponent } from '../../../layout/layout.component';
import { DropdownComponent } from "../dropdown/dropdown.component";



@Component({
  selector: 'shared-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  imports: [CommonModule, ReactiveFormsModule, DropdownComponent]
})
export class PaginatorComponent implements OnInit, OnDestroy, AfterViewInit {
  private _paginatorService: PaginatorService = inject(PaginatorService);

  @Input() public totalItems: number = 0;
  @Input() public rowsPerPageOptions: number[] = [];

  private _currentPageSubscription!: Subscription

  public isDropdownOpen: boolean = false;
  public itemsPerPage: number = 0;
  public currentPage: number = 1;
  public pageRange: number[] = [1, 2, 3, 4, 5]
  public itemsXPageForms!: FormGroup;

  constructor() {

  }
  ngAfterViewInit(): void {
    initFlowbite();
  }
  ngOnInit(): void {

    this.itemsPerPage = this.rowsPerPageOptions[0];

    this.itemsXPageForms = new FormGroup({
      itemsXPage: new FormControl(this.itemsPerPage),
    })
    this._currentPageSubscription = this._paginatorService.currentPage$.subscribe(
      (page) => {
        this.currentPage = page
        console.log("CURRENT ANTES: " + this.currentPage);
      }
    );

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

  }

  navigateToFirstPage() {
    this.currentPage = 1
    this._paginatorService.setCurrentPage(this.currentPage);
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

  }

  navigateToLastPage() {
    this.currentPage = Math.ceil(this.totalItems / this.itemsPerPage)
    this._paginatorService.setCurrentPage(this.currentPage);
    const newPageRange = Array.from({ length: 5 }, (_, i) => this.currentPage + i);
    this.pageRange = this.ensureValidPageRange(newPageRange, this.maxPages);

  }

  navigateToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    console.log("CURRENT ANTES: " + this.currentPage);
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

      return Array.from({ length: 5 }, (_, i) => 1 + i);
    } else if (lastPage > maxPages) {

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

  setItemsPerPage(selectedPage: number) {
    this.currentPage = 1;
    this.itemsPerPage = selectedPage;
    this._paginatorService.setPageSelector(this.itemsPerPage);
    this.pageRange = [1, 2, 3, 4, 5]
  }



  ngOnDestroy(): void {
    this._currentPageSubscription.unsubscribe();
  }
}
