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

  getSales(skip: number = 0, take: number): Observable<APIResponse<Sale>> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', take.toString());
    return this._http.get<APIResponse<Sale>>(this._url, { params })
  }
}
