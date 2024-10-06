import {Injectable, signal} from '@angular/core';
import {FeedbackService} from "./feedback.service";
import {TAN_TOKEN_LS_KEY} from "../constants"
import {Router} from "@angular/router";
import {AccountUpdateRequest, BasicMaintainerResponse, TangentialAuthService} from "../openapi";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public loading = signal(false)
  public accountUpdating = signal(false)

  public currentUser: BasicMaintainerResponse | undefined = undefined

  constructor(private tangentialAuthApi: TangentialAuthService, private feedbackService: FeedbackService, private router: Router) {
  }

  retrieveCurrentUser() {
    this.tangentialAuthApi.tangentialWhoAmI().subscribe({
      next: maintainer => {
        this.currentUser = maintainer
      }
    })
  }

  updateUserDetails(request: AccountUpdateRequest, then: () => void) {
    this.accountUpdating.set(true)
    this.tangentialAuthApi.updateProfileDetails(request).subscribe({
      next: resp => {
        this.retrieveCurrentUser()
        this.feedbackService.ok("Account Updated", "Successfully updated account details")
        then()
        this.accountUpdating.set(false)
      },
      error: err => {
        this.feedbackService.catalystError(err)
        this.accountUpdating.set(false)
      }
    })
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
        if (!this.feedbackService.catalystError(err, false))
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
