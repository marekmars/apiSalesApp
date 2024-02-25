import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';
import { User } from '../interfaces/user.iterfaces';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _http: HttpClient = inject(HttpClient);
  private _url = environments.baseUrl + '/users'
  constructor() { }
  getUserById(id: number): Observable<APIResponse<User>> {
    const url = this._url + `/${id}`;
    return this._http.get<APIResponse<User>>(url);
  }
  public getUserInfo(token: string): Observable<APIResponse<User>> {
    const decodedToken: any = jwtDecode(token);
    const userId: number = decodedToken.nameid;
    return this.getUserById(userId)
  }
}
