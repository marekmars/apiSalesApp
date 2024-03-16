import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { CommonModule } from '@angular/common';
import { Sale } from '../../interfaces/sales.interfaces';
import { StatePipe } from '../../../shared/pipes/statePipe.pipe';
import { SalesService } from '../../services/sales.service';
import { APIResponse } from '../../../shared/interfaces/api-response.interfaces';
import { PaginatorService } from '../../../shared/components/paginator/services/paginator.service';
import { Subscription, catchError, combineLatest, delay, of, switchMap, tap } from 'rxjs';
import { ActionValue } from '../../../shared/interfaces/action-values.interfaces';
import { SkeletonTableComponent } from "../../../shared/components/skeleton-views/components/skeleton-table/skeleton-table.component";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { SortByComponent } from "../../../shared/components/sort-by/sort-by.component";
import { SortBy, SortByEnum } from '../../../shared/interfaces/sort-by.interface';
import { SortByService } from '../../../shared/components/sort-by/services/sort-by.service';

import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { TableColumn, TableComponent } from "../../../shared/components/table/table.component";
import { User } from '../../../users/interfaces/user.interfaces';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  standalone: true,
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
  imports: [PaginatorComponent,
    CommonModule,
    StatePipe,
    SkeletonTableComponent,
    SearchBarComponent,
    SortByComponent,
    RouterLink, TableComponent]
})

export class SalesListComponent implements OnInit, OnDestroy {
  private _authService: AuthService = inject(AuthService);
  private _salesService: SalesService = inject(SalesService)
  private _paginatorService: PaginatorService = inject(PaginatorService);
  private _sortByService: SortByService = inject(SortByService);
  private _currentPageSubscription!: Subscription
  private _pageSelectorSubscription!: Subscription
  private _sortBySubscription!: Subscription

  public currentUser: User | null = null;

  public sortBy: SortBy = {
    sort: SortByEnum.id,
    desc: 0
  };

  public title: string = '';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';

  public columns: TableColumn[] = [
    {
      key: 'id', name: 'Sale N°', type: 'text'
    },
    {
      key: 'client', name: 'name', type: 'object', propertyName: 'name',
    },
    {
      key: 'client', name: 'last name', type: 'object', propertyName: 'lastName',
    },
    {
      key: 'date', name: 'date', type: 'date'
    },
    {
      key: 'total', name: 'total', type: 'money'
    },
  ];
  public allowedValuesArray: SortByEnum[] = [
    SortByEnum.id, SortByEnum.lastname, SortByEnum.date, SortByEnum.total, SortByEnum.name, SortByEnum.mail, SortByEnum.idcard
  ]
  public placeholder: string = 'Search...';
  public desc: number = 0
  public loading: boolean = true;
  public itemsEmpty: boolean = false;
  public show: boolean = false;
  public itemsPerPageOptions: number[] = [10, 15, 20];
  public itemsPerPage: number = this.itemsPerPageOptions[0];
  public currentPage: number = 1;
  public tableItems: Sale[] = [];
  public totalItems: number = 0;
  public showModal: boolean = false;
  // public actionValue: ActionValue<Sale>;

  constructor() {

  }

  public searchValue: string = '';
  public showDelete: boolean = false;
  ngOnInit(): void {
    this._authService.userObservable.subscribe((user) => {
      this.currentUser = user
      if (this.currentUser?.role?.name === 'Admin') {
        this.showDelete = true
      }
    })

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
    this._salesService.getSales(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage, filter, orderBy, desc)
      .subscribe((res: APIResponse<Sale>) => {
        if (res.data.length === 0) {
          this.itemsEmpty = true
        } else {
          this.loading = false
          this.itemsEmpty = false;
          this.totalItems = res.totalCount
          this.tableItems = res.data
        }

      })
  }


  doAction($event: ActionValue<Sale>) {
    if ($event.item) {

      switch ($event.action) {
        case "delete": {
          this.notificationTitle = 'Sale deleted'
          this.notificationDescription = 'The sale has been deleted successfully'
          this._salesService.deleteSales($event.item.id)
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
