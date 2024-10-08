import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {ConfirmationService, MessageService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from "@angular/common/http";
import {tokenInterceptor} from "./interceptor/token.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    MessageService,
    provideAnimations(),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
    ConfirmationService
  ]
};
