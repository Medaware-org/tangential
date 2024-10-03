import {Injectable, signal} from '@angular/core';
import {TangentialService} from "../openapi";
import {FeedbackService} from "./feedback.service";
import {TAN_TOKEN_LS_KEY} from "../constants"
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loading = signal(false)

  constructor(private tangentialApi: TangentialService, private feedbackService: FeedbackService, private router: Router) {
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

  isAuthenticated() {
    return this.localStorageSessionToken() != undefined
  }

  login(username: string, password: string) {
    this.loading.set(true)
    this.tangentialApi.tangentialLogin({
      username,
      password
    }).subscribe({
      next: token => {
        this.feedbackService.ok("Success", "Successfully Authenticated")
        this.storeSessionToken(token.token)

        // Give the user some time to see the success message
        setTimeout(() => {
          this.router.navigate(['/dash'])
          this.loading.set(false)
        }, 1500)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.loading.set(false)
      },
    })
  }

}
