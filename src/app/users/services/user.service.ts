import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';
import { Role, User } from '../interfaces/user.interfaces';
import { jwtDecode } from 'jwt-decode';
import { of } from 'rxjs';


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



  public getCurrentUser(token:string): Observable<APIResponse<User>> {
    return this._http.get<APIResponse<User>>(`${this._url}/current`, { headers: { Authorization: `Bearer ${token}` } })
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
    return this._http.patch<APIResponse<User>>(this._url, user)
  }
  public updateProfile(user: User): Observable<APIResponse<User>> {
    return this._http.patch<APIResponse<User>>(`${this._url}/profile`, user)
  }
  public deleteUser(id: number): Observable<APIResponse<User>> {
    console.log("DELETE SERVICE USER ",id)
    const url = this._url + `/${id}`;
    return this._http.delete<APIResponse<User>>(url)
  }
  public getRoles(): Observable<APIResponse<any>> {
    return this._http.get<APIResponse<any>>(`${environments.baseUrl}/roles`)
  }
}
