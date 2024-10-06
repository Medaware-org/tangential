import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {LoginService} from "../service/login.service";
import {ToastModule} from "primeng/toast";
import {Ripple} from "primeng/ripple";
import {BasicMaintainerResponse, TangentialAuthService} from "../openapi";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Button,
    ToastModule,
    Ripple,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(securityService: TangentialAuthService, private loginService: LoginService) {
    // When this returns UNAUTHORIZED, the interceptor will erase the token and return to the login screen.
    loginService.retrieveCurrentUser()
  }

  signOut() {
    this.loginService.logout()
  }

  currentUser(): BasicMaintainerResponse {
    return this.loginService.currentUser!
  }

}
