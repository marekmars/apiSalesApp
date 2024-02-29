import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sale } from '../../interfaces/sales.interfaces';
import { switchMap } from 'rxjs';
import { SalesService } from '../../services/sales.service';
import { initFlowbite } from 'flowbite';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    DatePickerComponent,
  SearchBarComponent],
  templateUrl: './sales-detail.component.html',
  styleUrl: './sales-detail.component.css'
})
export class SalesDetailComponent implements OnInit {

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _saleService: SalesService = inject(SalesService);
  private _router: Router = inject(Router);
  public sale: Sale | undefined = undefined;
  constructor() {
    initFlowbite();
  }
  ngOnInit(): void {
    this._activatedRoute.params
      .pipe(
        switchMap((params) =>
          {
            if (params.hasOwnProperty('id')) {
              console.log(params);
              return this._saleService.getSale(params['id'])
            }
            return [];
          }
        )
      )
      .subscribe(
        (res) => this.sale = res.data[0]
      )
  }

  public getDate(date: Date) {
    console.log(date);
  }
  public cancel(){
    this._router.navigate(['/sales'])
  }
}
