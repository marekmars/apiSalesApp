import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuth().pipe(
    map(res => {
      if (res) {
        console.log(res);
        return true;
      } else {
        console.log(res);
        const urlTreeReturn = router.createUrlTree(["auth/login"]);
        return urlTreeReturn;
      }
    })
  );

};
