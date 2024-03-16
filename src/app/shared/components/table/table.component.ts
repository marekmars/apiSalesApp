import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ActionValue } from '../../interfaces/action-values.interfaces';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DynamicPipe } from '../../pipes/dynamic.pipe';

export interface TableColumn {
  key: string;
  name: string;
  type: "text" | "number" | "date" | "boolean" | "money" | "object",
  propertyName?: string;
}
@Component({
  selector: 'shared-table',
  standalone: true,
  imports: [DynamicPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  public title: string = ''
  public columns: TableColumn[] = []
  public dataSource: any[] = []
  public routerLink: string = ''
  public showDelete: boolean = false
  private _router: Router = inject(Router)

  @Input() set tableData(value: any[]) {
    this.dataSource = value;
  }
  @Input() set tableTitle(value: string) {
    this.title = value;
  }
  @Input() set tableColumns(value: TableColumn[]) {
    this.columns = value;
  }
  @Input() set tableRouterLink(value: string) {
    this.routerLink = value;
  }
  @Input() set tableShowDelete(value: boolean) {
    this.showDelete = value;
  }
  @Output() action = new EventEmitter<ActionValue<any>>()

  onAction(action: "edit" | "delete" | "create" | "detail", item?: any) {

    if (action === "edit" || action === "create" || action === "delete") {
      {
        Swal.fire({
          title: `${action} ${this.title}`,
          text: `Are you sure you want to ${action} this element?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#4c822a",
          cancelButtonColor: "#d33 ",
          confirmButtonText: `Yes, ${action} it!`,
          customClass: {
            popup: 'swal2-dark',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.action.emit({ value: true, action: action, item: item })
          }
        });
      }
      return
    }

    this._router.navigateByUrl(`${this.routerLink}/${item.id}`)

  }

}
