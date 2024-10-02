import {EventEmitter, Injectable, signal} from '@angular/core';
import {TangentialService} from "../openapi";
import {FeedbackService} from "./feedback.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loading = signal(false)

  constructor(private tangentialApi: TangentialService, private feedbackService: FeedbackService) {
  }

  login(username: string, password: string) {
    this.loading.set(true)
    this.tangentialApi.tangentialLogin({
      username,
      password
    }).subscribe({
      next: token => {
        this.feedbackService.ok("Success", "Successfully Authenticated")
        this.loading.set(false)
      },
      error: err => {
        this.feedbackService.err("Log-in Failed", "Invalid credentials")
        this.loading.set(false)
      },
    })
  }

}
