import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AccountService} from "../service/account.service";

export const authGuard: CanActivateFn = (route, state) => {
  let isAuthenticated = inject(AccountService).isAuthenticated();

  if (!isAuthenticated)
    inject(Router).navigate(['/auth'])

  return isAuthenticated
};
