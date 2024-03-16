import { Injectable, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, switchMap, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response.interfaces';
import { Auth } from '../interfaces/auth.interfaces';
import { APIResponse } from '../../shared/interfaces/api-response.interfaces';
import { User } from '../../users/interfaces/user.interfaces';

import { Router } from '@angular/router';
import { UserService } from '../../users/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {


  private _http: HttpClient = inject(HttpClient);
  private _url = environments.baseUrl + '/users'
  private _router: Router = inject(Router);
  private _userService: UserService = inject(UserService);
  private _userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public userObservable: Observable<User | null> = this._userSubject.asObservable();
  constructor() {
    this.initCurrentUserFromLocalStorage();
  }


  ngOnInit(): void {
    this.initCurrentUserFromLocalStorage(); // Llamada al método si el servicio implementa OnInit
  }
  private initCurrentUserFromLocalStorage(): void {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this._userService.getCurrentUser(storedToken).subscribe({
        next: (user) => {
          this._userSubject.next(user.data[0]);
        }
      });
    }
  }

  login(auth: Auth): Observable<APIResponse<AuthResponse>> {
    const url = this._url + '/login';
    return this._http.post<APIResponse<AuthResponse>>(url, auth)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.data[0].token);
          this._userService.getCurrentUser(res.data[0].token).subscribe({
            next: (user) => {
              this._userSubject.next(user.data[0]);// Cambiado a currentUserSubject
            }
          })

        }),
        catchError(() => of({ success: 0, message: 'Error', data: [], totalCount: 0 } as APIResponse<AuthResponse>))
      );
  }
  updateCurrentUser(user: User) {
    this._userSubject.next(user);
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
