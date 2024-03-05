import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';

import { Observable } from 'rxjs';
import { Product } from '../interfaces/products.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _http: HttpClient = inject(HttpClient)
  private _url = environments.baseUrl + '/products';
  constructor() { }
  getProducts(skip?: number, take?: number, filter?: string, orderBy?: string, desc?: number): Observable<APIResponse<Product>> {
    let params = new HttpParams();
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (take !== undefined) {
      params = params.set('limit', take.toString());
    }
    if (filter !== undefined) {
      params = params.set('filter', filter);
    }
    if (orderBy !== undefined) {
      params = params.set('orderBy', orderBy.toLowerCase().replace(/\s/g, ''));
    }
    if (desc !== undefined) {
      params = params.set('desc', desc.toString());
    }
    console.log("ENTRO SERVICIO PRODUCTS");

    return this._http.get<APIResponse<Product>>(this._url, { params });
  }



}