import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminUsermanagementService {

  constructor(
    private apiservice: ApiService,
    private jwtService: JwtService,
    private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getUsers(params: any): Observable<any> {
    let queryParams = [];
    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined) {
            queryParams.push(`${key}=${params[key]}`);
        }
    }
    const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

    return this.apiservice.get('admin/users' + queryString, this.getHeaders()).pipe(
      tap((error: any) => {
        console.log('Response received:', error);
        this.erromessagefunction(error);
      }),
    );
  }

  addUser(userData: any): Observable<any> {
    return this.apiservice.post('admin/users', userData, { headers: this.getHeaders() }).pipe(
      tap((error: any) => {
        this.erromessagefunction(error);
      }),
    );
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.apiservice.post(`admin/users/${id}`, userData, { headers: this.getHeaders() }).pipe(
      tap((error: any) => {
        this.erromessagefunction(error);
      }),
    );
  }

  toggleUserStatus(id: number, statusData: any): Observable<any> {
    return this.apiservice.patch(`admin/users/${id}/status`, statusData, { headers: this.getHeaders() }).pipe(
      tap((error: any) => {
        this.erromessagefunction(error);
      }),
    );
  }

  erromessagefunction(error: any) {
    console.log('Response received:', error);
    var response = error;
    var errorMessage;
    if (
      typeof response.message === 'object' &&
      response.message !== null &&
      !Array.isArray(response.message)
    ) {
      errorMessage = JSON.stringify(response.message);
    } else {
      errorMessage = response.message;
    }
    console.log(response);
    if (
      error.status === 422 &&
      error.message &&
      (errorMessage.includes('The selected user id is invalid') ||
        errorMessage.includes('Your account has been deactivated') ||
        errorMessage.includes('Your token has been expired') ||
        errorMessage.includes(
          'Your token has been expired. Please login again.',
        ))
    ) {
      this.jwtService.clearStorage(); 
      this.router.navigate(['/sign_in']); 
      alert(errorMessage); 
    } else if (error && error.message) {
      // Display error message
      // alert(errorMessage);
    }
  }
}
