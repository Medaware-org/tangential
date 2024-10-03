import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {LoginService} from "../service/login.service";
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let loginService = inject(LoginService)
  let router = inject(Router)

  let token = loginService.localStorageSessionToken()

  if (token)
    return next(req.clone({
      headers: req.headers.set('Authorization', token)
    })).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          loginService.eraseSessionToken()
          router.navigate(['/auth'])
        }
        return throwError(() => err);
      })
    )

  return next(req);
};
