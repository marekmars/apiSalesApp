import { Component, OnInit, inject } from '@angular/core';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../../shared/components/alert/alert.component";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { Sale } from '../../interfaces/sales.interfaces';
import { StatePipe } from '../../../shared/pipes/statePipe.pipe';
import { SalesService } from '../../services/sales.service';
import { APIResponse } from '../../../shared/interfaces/api-response.interfaces';
import { PaginatorService } from '../../../shared/components/paginator/services/paginator.service';
import { Subscription } from 'rxjs';
import { ActionValue } from '../../../shared/interfaces/action-values.interfaces';
import { SkeletonTableComponent } from "../../../shared/components/skeleton-views/components/skeleton-table/skeleton-table.component";

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
  imports: [PaginatorComponent, CommonModule, AlertComponent, DialogComponent, StatePipe, SkeletonTableComponent]
})
export class SalesListComponent implements OnInit {
  private _salesService: SalesService = inject(SalesService)

  private paginatorService: PaginatorService = inject(PaginatorService);
  private currentPageSubscription!: Subscription
  private pageSelectorSubscription!: Subscription

  public isAlertOn: boolean = false;
  public itemsPerPage: number = 0;
  public itemsPerPageOptions: number[] = [ 10, 15, 20];
  public currentPage: number = 1;
  public tableItems: Sale[] = [];
  public totalItems: number = 0;
  public show: boolean = false;
  public actionValue: ActionValue = {
    action: '',
    value: ''
  }
  public headers: string[] = ['id', 'Client Id', 'Date', 'Total', 'State', 'Actions'];
  constructor() {
    this.itemsPerPage = this.itemsPerPageOptions[0]
  }
  ngOnInit(): void {
    this.currentPageSubscription = this.paginatorService.currentPage$.subscribe(
      (page) => {

        this.currentPage = page
        this.getValues();
      }
    );
    this.pageSelectorSubscription = this.paginatorService.pageSelectorSubject$.subscribe(
      (page) => {

        this.itemsPerPage = page;
        this.currentPage = 1
        this.getValues();
      }
    )

  }
  getValues(): void {
    this._salesService.getSales(this.itemsPerPage * (this.currentPage - 1), this.itemsPerPage).subscribe({
      next: (res: APIResponse<Sale>) => {
        this.tableItems = res.data
        this.totalItems = res.totalCount
      }
    })
  }
  // onPageSelectorChange(itemsPage: number) {

  //   // this.itemsPerPage = itemsPage;
  //   // this.currentPage = 1
  //   // this.getValues();
  // }
  // onPageChange(pageIndex: number) {

  //   // this.currentPage = pageIndex
  //   // this.getValues();
  // }
  onActionClick($event: ActionValue) {
    this.actionValue = $event;
    this.showDialog();
  }
  private deleteElement(id: number | string) {
    if (this.tableItems) {
      this.tableItems = this.tableItems.filter((item) => {
        if (item.id) {
          item.id !== id
        }
      }
      );
    }
  }
  showDialog() {
    this.show = true;
  }
  onAlertClosed() {
    throw new Error('Method not implemented.');
  }
  doAction($event: boolean) {
    if ($event) {
      switch (this.actionValue.action) {
        case "delete": {
          this.deleteElement(this.actionValue.value);
          this.actionValue = {
            action: '',
            value: ''
          };
          break;
        }
      }
    }
    this.show = false;
  }



  ngOnDestroy(): void {
    this.currentPageSubscription.unsubscribe();
    this.pageSelectorSubscription.unsubscribe();
  }

}
