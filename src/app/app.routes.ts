import {Routes} from '@angular/router';
import {AuthenticationComponent} from "./authentication/authentication.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {authGuard} from "./guard/auth.guard";

export const routes: Routes = [
  {
    path: "auth",
    pathMatch: "full",
    component: AuthenticationComponent
  },
  {
    path: "dash",
    pathMatch: "full",
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: "",
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: "",
    component: AuthenticationComponent
  }
];
