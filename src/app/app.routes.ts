import {Routes} from '@angular/router';
import {AuthenticationComponent} from "./authentication/authentication.component";

export const routes: Routes = [
  {
    path: "auth",
    pathMatch: "full",
    component: AuthenticationComponent
  },
  {
    path: "",
    component: AuthenticationComponent
  }
];
