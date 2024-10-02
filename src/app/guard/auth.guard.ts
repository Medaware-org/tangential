import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {LoginService} from "../service/login.service";

export const authGuard: CanActivateFn = (route, state) => {
  let isAuthenticated = inject(LoginService).isAuthenticated();
  if (!isAuthenticated)
    inject(Router).navigate(['/auth'])
  return isAuthenticated
};
