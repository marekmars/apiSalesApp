import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../../shared/components/alert/alert.component";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { Sale } from '../../interfaces/sales.interfaces';
import { StatePipe } from '../../../shared/pipes/statePipe.pipe';
import { SalesService } from '../../services/sales.service';
import { APIResponse } from '../../../shared/interfaces/api-response.interfaces';
import { PaginatorService } from '../../../shared/components/paginator/services/paginator.service';
import { Subscription, combineLatest, delay, switchMap } from 'rxjs';
import { ActionValue } from '../../../shared/interfaces/action-values.interfaces';
import { SkeletonTableComponent } from "../../../shared/components/skeleton-views/components/skeleton-table/skeleton-table.component";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { SearchBarService } from '../../../shared/components/search-bar/services/search-bar.service';
import { SortByComponent } from "../../../shared/components/sort-by/sort-by.component";
import { SortBy, SortByEnum } from '../../../shared/interfaces/sort-by.interface';
import { SortByService } from '../../../shared/components/sort-by/services/sort-by.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
  imports: [PaginatorComponent,
    CommonModule,
    AlertComponent,
    DialogComponent,
    StatePipe,
    SkeletonTableComponent,
    SearchBarComponent,
    SortByComponent,
    RouterLink]
})

export class SalesListComponent implements OnInit {


  private _salesService: SalesService = inject(SalesService)
  private _paginatorService: PaginatorService = inject(PaginatorService);
  private _searchBarService: SearchBarService = inject(SearchBarService);
  private _sortByService: SortByService = inject(SortByService);


  private _currentPageSubscription!: Subscription
  private _pageSelectorSubscription!: Subscription
  private _searchSubscription!: Subscription
  private _sortBySubscription!: Subscription

  public sortBy: SortBy = {
    sort: SortByEnum.id,
    desc: 0
  };


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
  public actionValue: ActionValue<Sale>;
  constructor() {
    this.actionValue = {
      action: '',
      value: false,
      item: null
    }
  }

  public searchValue: string = '';
  public headers: string[] = ['id', 'Client Name', 'Date', 'Total', 'State', 'Actions'];


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
      }
    )

    this._searchSubscription = this._searchBarService.searchSubject$.subscribe(
      (search) => {
        this.searchValue = search
        this.currentPage = 1
        this._paginatorService.setCurrentPage(this.currentPage)

        // this.getValues(this.sortBy.desc, search, this.sortBy.sort)
      }
    );

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
    this.loading = true
    this._salesService.getSales(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage, filter, orderBy, desc)
      .subscribe((res: APIResponse<Sale>) => {
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


  onActionClick(values: { action: string, item: Sale }) {
    this.actionValue.action = values.action as "edit" | "delete" | "create" | "";
    this.actionValue.item = values.item;
    console.log(values)
    this.showDialog();
  }

  showDialog() {
    this.showModal = true;

  }
  onDialogClosed() {
    this.showModal = false;
    this.show = true;
    setTimeout(() => {
      this.show = false

    }, 2000)
  }

  doAction($event: ActionValue<Sale>) {
    console.log($event)
    if ($event.item) {
      switch (this.actionValue.action) {
        case "delete": {
          this._salesService.deleteSales($event.item.id).subscribe(
            (res) => {
              this.getValues(this.sortBy.desc, this.searchValue, this.sortBy.sort)
              this.onDialogClosed();
            }
          )
          this.actionValue = {
            action: '',
            value: false,
            item: null
          };
          break;
        }
      }
    }
    this.showModal = false;
  }



  ngOnDestroy(): void {
    this._currentPageSubscription.unsubscribe();
    this._pageSelectorSubscription.unsubscribe();
    this._searchSubscription.unsubscribe();
    this._sortBySubscription.unsubscribe();
  }

}
