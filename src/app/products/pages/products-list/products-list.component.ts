import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, tap, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';

import { PaginatorService } from '../../../shared/components/paginator/services/paginator.service';
import { SortByService } from '../../../shared/components/sort-by/services/sort-by.service';
import { ActionValue } from '../../../shared/interfaces/action-values.interfaces';
import { APIResponse } from '../../../shared/interfaces/api-response.interfaces';
import { SortBy, SortByEnum } from '../../../shared/interfaces/sort-by.interface';
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { SortByComponent } from "../../../shared/components/sort-by/sort-by.component";
import { SkeletonTableComponent } from "../../../shared/components/skeleton-views/components/skeleton-table/skeleton-table.component";
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { ProductService } from '../../services/products.service';
import { Product } from '../../interfaces/products.interfaces';




@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  imports: [TableComponent, CommonModule, RouterLink, SearchBarComponent, SortByComponent, SkeletonTableComponent, PaginatorComponent]
})
export class ProductsListComponent implements OnInit, OnDestroy {


  private _productService: ProductService = inject(ProductService)
  private _paginatorService: PaginatorService = inject(PaginatorService);
  private _sortByService: SortByService = inject(SortByService);
  private _currentPageSubscription!: Subscription
  private _pageSelectorSubscription!: Subscription
  private _sortBySubscription!: Subscription

  public sortBy: SortBy = {
    sort: SortByEnum.id,
    desc: 0
  };

  public title: string = 'Sales';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';

  public columns: TableColumn[] = [
    {
      key: 'id', name: 'product N°', type: 'text'
    },
    {
      key: 'name', name: 'product name', type: 'text'
    },
    {
      key: 'unitaryPrice', name: 'unitary price', type: 'money'
    },
    {
      key: 'cost', name: 'cost', type: 'money'
    },
    {
      key: 'stock', name: 'stock', type: 'text'
    },
  ];
  public placeholder: string = 'Search...';
  public desc: number = 0
  public loading: boolean = true;
  public itemsEmpty: boolean = false;
  public show: boolean = false;
  public itemsPerPageOptions: number[] = [10, 15, 20];
  public itemsPerPage: number = this.itemsPerPageOptions[0];
  public currentPage: number = 1;
  public tableItems: Product[] = [];
  public totalItems: number = 0;
  public showModal: boolean = false;
  // public actionValue: ActionValue<Product>;

  constructor() {

  }

  public searchValue: string = '';
  public allowedValuesArray: SortByEnum[] = [
    SortByEnum.id, SortByEnum.name, SortByEnum.price, SortByEnum.cost, SortByEnum.stock
  ]

  ngOnInit(): void {
    this._currentPageSubscription = this._paginatorService.currentPage$.subscribe(
      (page) => {
        this.currentPage = page
        this.getValues(this.sortBy.desc, this.searchValue, this.sortBy.sort)
      }
    );
    this._pageSelectorSubscription = this._paginatorService.pageSelectorSubject$.subscribe(
      (page) => {
        this.itemsPerPage = page;
        this.currentPage = 1
        // this._paginatorService.setCurrentPage(this.currentPage)
        this.getValues(0, this.searchValue, "")
        // this.getValues(this.sortBy.desc, this.searchValue, this.sortBy.sort)
      }
    )

    this._sortBySubscription = this._sortByService.sortBy$.subscribe(
      (sortBy) => {
        this.currentPage = 1
        this._paginatorService.setCurrentPage(this.currentPage)
        this.sortBy = sortBy
        // this.getValues(sortBy.desc, this.searchValue, sortBy.sort)
      }
    );
    this.getValues(this.sortBy.desc, this.searchValue, this.sortBy.sort)
  }


  getValues(desc: number, filter?: string, orderBy?: string,): void {
    // this.loading = true
    this._productService.getProducts(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage, filter, orderBy, desc)
      .subscribe((res: APIResponse<Product>) => {
        if (res.data.length === 0) {
          this.itemsEmpty = true
        } else {
          this.loading = false
          this.itemsEmpty = false;
          this.totalItems = res.totalCount
          this.tableItems = res.data
          console.log(this.tableItems)
        }
      })
  }


  doAction($event: ActionValue<Product>) {
    if ($event.item) {

      switch ($event.action) {
        case "delete": {
          this.notificationTitle = 'Product deleted'
          this.notificationDescription = 'The sale has been deleted successfully'
          this._productService.deleteProduct($event.item.id)
            .pipe(
              tap((result) => {
                Swal.fire({
                  title: this.notificationTitle,
                  text: this.notificationDescription,
                  confirmButtonColor: "#4c822a",
                  icon: "success",
                  customClass: {
                    popup: 'swal2-dark',
                  }
                })
              }),
              catchError(() => {
                Swal.fire({
                  title: "Error",
                  text: "The sale could not be deleted",
                  confirmButtonColor: "#4c822a",
                  icon: "error",
                  customClass: {
                    popup: 'swal2-dark',
                  }
                })
                return of({ error: true })
              }),

            )
            .subscribe(
              (res) => {
                this.getValues(this.sortBy.desc, this.searchValue, this.sortBy.sort)
              }
            )


          break;
        }
      }
    }
    this.showModal = false;
  }

  search(search: string) {
    this.searchValue = search;
    this.currentPage = 1
    this._paginatorService.setCurrentPage(this.currentPage)
    // this.getValues(this.sortBy.desc, this.searchValue, this.sortBy.sort)
  }

  ngOnDestroy(): void {
    this._currentPageSubscription.unsubscribe();
    this._pageSelectorSubscription.unsubscribe();
    this._sortBySubscription.unsubscribe();
  }
}
