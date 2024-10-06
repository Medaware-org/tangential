import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AccountService} from "../service/account.service";
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let accountService = inject(AccountService)
  let router = inject(Router)

  let token = accountService.localStorageSessionToken()

  if (token)
    return next(req.clone({
      headers: req.headers.set('Authorization', token)
    })).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          accountService.eraseSessionToken()
          router.navigate(['/auth'])
        }
        return throwError(() => err);
      })
    )

  return next(req);
};
