import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';


export const loginGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if(localStorage.getItem('token')){
    router.navigate(['/home']);
    return false
  }else{
    return true
  }

};
