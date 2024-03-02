import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';
import { Client } from '../interfaces/clients.interface';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private _http: HttpClient = inject(HttpClient)
  private _url = environments.baseUrl + '/clients'
  constructor() { }
  getClients(skip?: number, take?: number, filter?: string, orderBy?: string, desc?: number): Observable<APIResponse<Client>> {
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
    console.log("ENTRO SERVICIO");
    return this._http.get<APIResponse<Client>>(this._url, { params });
}
}
