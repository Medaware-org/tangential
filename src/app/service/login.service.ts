import {Injectable, signal} from '@angular/core';
import {TangentialService} from "../openapi";
import {FeedbackService} from "./feedback.service";
import {TAN_TOKEN_LS_KEY} from "../constants"

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loading = signal(false)

  constructor(private tangentialApi: TangentialService, private feedbackService: FeedbackService) {
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
        this.loading.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.loading.set(false)
      },
    })
  }

}
