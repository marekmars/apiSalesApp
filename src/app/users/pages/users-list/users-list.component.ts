import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PaginatorService } from '../../../shared/components/paginator/services/paginator.service';
import { SortByService } from '../../../shared/components/sort-by/services/sort-by.service';
import { Subscription, catchError, of, tap } from 'rxjs';
import { SortBy, SortByEnum } from '../../../shared/interfaces/sort-by.interface';
import { TableColumn, TableComponent } from '../../../shared/components/table/table.component';
import { User } from '../../interfaces/user.interfaces';
import { APIResponse } from '../../../shared/interfaces/api-response.interfaces';
import { ActionValue } from '../../../shared/interfaces/action-values.interfaces';
import Swal from 'sweetalert2';
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { SortByComponent } from "../../../shared/components/sort-by/sort-by.component";
import { SkeletonTableComponent } from "../../../shared/components/skeleton-views/components/skeleton-table/skeleton-table.component";
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  imports: [
    SearchBarComponent,
    SortByComponent,
    SkeletonTableComponent,
    TableComponent,
    PaginatorComponent,
    CommonModule,
    RouterLink
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  private _authService: AuthService = inject(AuthService);
  private _productService: UserService = inject(UserService)
  private _paginatorService: PaginatorService = inject(PaginatorService);
  private _sortByService: SortByService = inject(SortByService);
  private _currentPageSubscription!: Subscription
  private _pageSelectorSubscription!: Subscription
  private _sortBySubscription!: Subscription

  public sortBy: SortBy = {
    sort: SortByEnum.id,
    desc: 0
  };
  public showDelete: boolean = false;
  public currentUser: User | null = null;
  public title: string = 'Users';
  public description: string = '';
  public okBtnTxt: string = '';
  public cancelBtnTxt: string = '';
  public notificationTitle: string = '';
  public notificationDescription: string = '';

  public columns: TableColumn[] = [
    {
      key: 'id', name: 'User N°', type: 'text'
    },
    {
      key: 'role', name: 'role', type: 'object', propertyName: 'name'
    },
    {
      key: 'mail', name: 'email', type: 'text'
    },
    {
      key: 'name', name: 'name', type: 'text'
    },
    {
      key: 'lastName', name: 'Last Name', type: 'text'
    },
    {
      key: 'idCard', name: 'id card', type: 'text'
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
  public tableItems: User[] = [];
  public totalItems: number = 0;
  public showModal: boolean = false;
  // public actionValue: ActionValue<User>;

  constructor() {

  }

  public searchValue: string = '';
  public allowedValuesArray: SortByEnum[] = [
    SortByEnum.id, SortByEnum.name, SortByEnum.lastname, SortByEnum.mail, SortByEnum.role, SortByEnum.idcard
  ]

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
    this._productService.getUsers(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage, filter, orderBy, desc)
      .subscribe((res: APIResponse<User>) => {
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


  doAction($event: ActionValue<User>) {
    if ($event.item) {

      switch ($event.action) {
        case "delete": {
          this.notificationTitle = 'User deleted'
          this.notificationDescription = 'The sale has been deleted successfully'
          this._productService.deleteUser($event.item.id)
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
    console.log(search)
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
