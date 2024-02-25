import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response.interfaces';
import { Auth } from '../interfaces/auth.interfaces';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';
import { User } from '../../users/interfaces/user.iterfaces';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public userObservable: Observable<User | null> = this.userSubject.asObservable();
  private _http: HttpClient = inject(HttpClient);
  private _url = environments.baseUrl + '/users'
  private _router: Router = inject(Router);
  constructor() {

  }

  login(auth: Auth): Observable<APIResponse<AuthResponse>> {
    const url = this._url + '/login';

    return this._http.post<APIResponse<AuthResponse>>(url, auth)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.data[0].token);
        }),
        catchError(() => of({ success: 0, message: 'Error', data: [], totalCount: 0 } as APIResponse<AuthResponse>))
      );
  }
  logout() {
    localStorage.clear();
  }
  checkAuth(): Observable<boolean> {

    if (!localStorage.getItem('token')) {
      this._router.navigateByUrl('/auth/login');
      return of(false)
    };

    return of(true);
  }

}
