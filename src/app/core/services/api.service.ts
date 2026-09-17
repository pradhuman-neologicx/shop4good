import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from './notificationnew.service';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  private formatErrors = (error: any) => {
    return throwError(() => error);
  }

  // private formatErrors(error: any) {
  //   const errorMessage = this.handleResponseError(error);
  //   console.log(errorMessage);
  //   return throwError(() => errorMessage);
  // }

  // private handleResponseError(error: any): string {
  //   let errorMessage = '';

  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side error
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // Server-side error
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

  //     if (
  //       error.status === 422 &&
  //       error.error.message &&
  //       (error.error.message.includes('The selected user id is invalid') ||
  //         error.error.message.includes('Your account has been deactivated') ||
  //         error.error.message.includes('Your token has been expired') ||
  //         error.error.message.includes(
  //           'Your token has been expired. Please login again.'
  //         ))
  //     ) {
  //       // Log user out and redirect to home route if token is expired
  //       this.jwtService.clearStorage(); // Clear token (implement this method in your JwtService)
  //       this.router.navigate(['/sign_in']); // Navigate to home route
  //       alert(error.error.message); // Show alert with error message

  //     } else if (error.error && error.error.message) {
  //       alert(error.error.message); // Show alert with error message
  //     } else {
  //       alert('Something went wrong');
  //     }
  //   }

  //   return errorMessage;
  // }
  // search(term: string) {
  //   if (term === "") {
  //     return of([]);
  //   }
  //   return this.http
  //     .get<[any, any[]]>(
  //       `${environment.api_url}routes?odata?$filter=contains(routeSourceName,` +
  //       `${term}` +
  //       `)`
  //     )
  //     .pipe(map((response: any) => response["routesModel"]));

  // }
  get(path: string, options: any = {}): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, options)
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: any, options: any = {}): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, body, options)
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  post(path: string, body: any, options: any = {}): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, body, options)
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  delete(path: string, options: any = {}): Observable<any> {
    return this.http
      .delete(`${environment.api_url}${path}`, options)
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  patch(path: string, body: any, options: any = {}): Observable<any> {
    return this.http
      .patch(`${environment.api_url}${path}`, body, options)
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  putWithoutHeader(path: string, body: any): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, body)
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  postwithoutbody(path: string, headers: HttpHeaders): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, {}, { headers })
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  postWithoutHeader(path: string, body: any): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, body)
      .pipe(
        catchError(this.formatErrors),
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteFun(
    path: string,
    options: { headers?: HttpHeaders } = {}
  ): Observable<any> {
    return this.http.delete(`${environment.api_url}${path}`, options).pipe(
      retry(1),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  handleError = (error: any) => {
    let errorMessage = 'An unexpected error occurred';
    
    // Check if error is an HttpErrorResponse
    if (error.error) {
      if (error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (error.status === 401) {
      this.jwtService.clearStorage();
      this.router.navigate(['/sign_in']);
    }

    if (error.status === 422 && error.error?.errors) {
      const errs = error.error.errors;
      errorMessage =
        errs?.name?.[0] ||
        errs?.email?.[0] ||
        errs?.mobile?.[0] ||
        errs?.input_fields?.[0] ||
        errs?.material_id?.[0] || 
        errorMessage;
    }

    this.notificationService.show(errorMessage, 'error');
    
    return throwError(() => new Error(errorMessage));
  }
}
