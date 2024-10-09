import {Routes} from '@angular/router';
import {AuthenticationComponent} from "./authentication/authentication.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {authGuard} from "./guard/auth.guard";
import {OverviewComponent} from "./dashboard/overview/overview.component";
import {ProfileComponent} from "./dashboard/profile/profile.component";
import {MaintenanceComponent} from "./dashboard/maintenance/maintenance.component";
import {AnalyticsComponent} from "./dashboard/analytics/analytics.component";
import {EditorComponent} from "./editor/editor/editor.component";

export const routes: Routes = [
  {
    path: "auth",
    pathMatch: "full",
    component: AuthenticationComponent
  },
  {
    path: "dash",
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "overview",
        component: OverviewComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "maintenance",
        component: MaintenanceComponent
      },
      {
        path: "analytics",
        component: AnalyticsComponent
      },
      {
        path: "**",
        redirectTo: '/dash/overview'
      }
    ]
  },
  {
    path: "editor/:id",
    component: EditorComponent,
    canActivate: [authGuard],
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/dash/overview",
  },
  {
    path: "**",
    component: AuthenticationComponent
  }
];
