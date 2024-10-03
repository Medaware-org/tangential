import {Injectable, signal} from '@angular/core';
import {FeedbackService} from "./feedback.service";
import {TAN_TOKEN_LS_KEY} from "../constants"
import {Router} from "@angular/router";
import {TangentialAuthService} from "../openapi";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loading = signal(false)

  constructor(private tangentialAuthApi: TangentialAuthService, private feedbackService: FeedbackService, private router: Router) {
  }

  localStorageSessionToken(): string | undefined {
    return localStorage.getItem(TAN_TOKEN_LS_KEY) || undefined
  }

  storeSessionToken(token: string) {
    localStorage.setItem(TAN_TOKEN_LS_KEY, token)
  }

  eraseSessionToken() {
    localStorage.removeItem(TAN_TOKEN_LS_KEY)
  }

  logout() {
    this.tangentialAuthApi.tangentialLogout().subscribe({
      next: _ => {
        this.eraseSessionToken()
        this.feedbackService.ok("Signed Out", "Your current session has been invalidated on the server")
        this.router.navigate(['/auth'])
      },
      error: err => {
        if (!this.feedbackService.catalystError(err))
          this.feedbackService.err("Error", "Could not invalidate the session! Please contact the system administrator!")
      }
    })
  }

  isAuthenticated() {
    return this.localStorageSessionToken() != undefined
  }

  login(username: string, password: string) {
    this.loading.set(true)
    this.tangentialAuthApi.tangentialLogin({
      username,
      password
    }).subscribe({
      next: token => {
        this.feedbackService.ok("Success", "Successfully Authenticated")
        this.storeSessionToken(token.token)
        this.router.navigate(['/dash'])
        this.loading.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.loading.set(false)
      }
    })
  }

}
