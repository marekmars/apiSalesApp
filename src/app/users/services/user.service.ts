import { HttpClient, HttpParams } from '@angular/common/http';
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
  getUser(id: number): Observable<APIResponse<User>> {
    return this._http.get<APIResponse<User>>(this._url + '/' + id);
  }
  public getUserInfo(token: string): Observable<APIResponse<User>> {
    const decodedToken: any = jwtDecode(token);
    const userId: number = decodedToken.nameid;
    return this.getUserById(userId)
  }

  public getUsers(skip: number = 0, take: number, filter: string | undefined, orderBy: string | undefined, desc: number): Observable<APIResponse<User>> {
    const params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', take.toString())
      .set('filter', filter ? filter : '')
      .set('orderBy', orderBy ? orderBy.toLowerCase().replace(/\s/g, '') : '')
      .set('desc', desc);
    return this._http.get<APIResponse<User>>(this._url, { params });
  }
  public addUser(user: User): Observable<APIResponse<User>> {
    return this._http.post<APIResponse<User>>(this._url, user)
  }
  public updateUser(user: User): Observable<APIResponse<User>> {
    return this._http.put<APIResponse<User>>(this._url, user)
  }
  public deleteUser(id: number): Observable<APIResponse<User>> {
    const url = this._url + `/${id}`;
    return this._http.delete<APIResponse<User>>(url)
  }
}
