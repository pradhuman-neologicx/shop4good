import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, ErrorHandler } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatePipe, CommonModule } from '@angular/common';

import { DataService } from './core/services/data.service';
import { ApiService } from './core/services/api.service';
import { JwtService } from './core/services/jwt.service';
import { EmployeeService } from './core/services/Employee.service';
import { LoadingInterceptor } from './core/services/loading.interceptor';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { ChunkErrorHandler } from './core/services/chunk-error-handler';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes, 
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    
    DataService,
    ApiService,
    JwtService,
    DatePipe,
    EmployeeService,
    
    { provide: ErrorHandler, useClass: ChunkErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    importProvidersFrom(
      FormsModule, 
      ReactiveFormsModule, 
      NgSelectModule, 
      CommonModule, 
      MatMenuModule, 
      NgxPaginationModule
    )
  ]
};
