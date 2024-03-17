import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Sale } from '../interfaces/sales.interfaces';
import { Observable } from 'rxjs';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private _http: HttpClient = inject(HttpClient)
  private _url = environments.baseUrl + '/sales'
  constructor() {

  }

  getSales(
    skip: number = 0,
    take: number, filter: string | undefined,
    orderBy: string | undefined,
    desc: number,
    startDate?: Date,
    endDate?: Date,
  ): Observable<APIResponse<Sale>> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', take.toString())
      .set('filter', filter ? filter : '')
      .set('orderBy', orderBy ? orderBy.toLowerCase().replace(/\s/g, '') : '')
      .set('desc', desc)
      .set('startDate', startDate ? startDate.toISOString() : '')
      .set('endDate', endDate ? endDate.toISOString() : '')
      ;
    console.log("ENTRO SERVICIO VENTA");
    return this._http.get<APIResponse<Sale>>(this._url, { params })
  }
  deleteSales(id: number): Observable<APIResponse<Sale>> {    // if (filter) {
    return this._http.delete<APIResponse<Sale>>(`${this._url}/${id}`)
  }
  getSale(id: number): Observable<APIResponse<Sale>> {    // if (filter) {
    return this._http.get<APIResponse<Sale>>(`${this._url}/${id}`)
  }
  addSale(sale: Sale): Observable<APIResponse<Sale>> {
    return this._http.post<APIResponse<Sale>>(this._url, sale)
  }
  updateSale(sale: Sale) {
    return this._http.patch<APIResponse<Sale>>(this._url, sale);
  }


}
