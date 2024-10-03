import {Component} from '@angular/core';
import {SecurityService} from "../openapi";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(securityService: SecurityService) {
    // When this returns UNAUTHORIZED, the interceptor will erase the token and return to the login screen.
    securityService.securedRoute().subscribe({
      next: _ => {
        console.log("[ Tangential session is still valid ]")
      },
      error: _ => {
        console.log("[ ! Session is invalid. Returning to auth ! ]")
      }
    })
  }

}
