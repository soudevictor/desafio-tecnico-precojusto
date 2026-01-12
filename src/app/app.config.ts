import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { apiInterceptor } from './core/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // NOTE: withInterceptors registra o interceptor pra todas as requisições
    // INFO: É parecido com axios.interceptors.request.use() do React
    provideHttpClient(withInterceptors([apiInterceptor])),
  ],
};
