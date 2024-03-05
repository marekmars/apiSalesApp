import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  public title: string = ''
  public columns: string[] = []
  public dataSource: any[] = []

  @Input() set tableData(value: any[]) {

  }
  @Input() set tableTitle(value: string) {

  }
  @Input() set tableColumns(value: string[]) {

  }

}
