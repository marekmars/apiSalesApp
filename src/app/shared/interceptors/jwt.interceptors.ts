import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable } from "rxjs/internal/Observable";
import { AuthService } from "../../auth/services/auth.service";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

// @Injectable({ providedIn: 'root' })

// export class JwtInterceptor implements HttpInterceptor {

//   private _authService: AuthService=inject(AuthService);;
//   url: string = 'http://localhost:5241/api/Usuarios/login';


//   constructor() {

//   }


//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const usuario = this._authService.token;
//     if (usuario) {
//       console.log("Usuario: " + usuario);
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${usuario.token}`
//         }
//       });
//     }
//     return next.handle(request);
//   }
// }
export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
 
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
