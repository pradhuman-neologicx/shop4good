import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private approvalStageMessage = new BehaviorSubject('');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  GetBatches: any;
  updateBatches: any;
  GetCourseType: any;

  constructor(
    private http: HttpClient,
    private apiservice: ApiService,
    private jwtService: JwtService,
    private router: Router,
  ) {}

  GetStates() {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.apiservice.get('states', headers).pipe(
      tap((error: any) => {
        console.log('Response received:', error);
        this.erromessagefunction(error);
      }),
    );
  }

  getCity(state_id: any): Observable<any> {
    const token = this.jwtService.getToken(); // Get the token for authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = {
      state_id: state_id,
    };

    // Make the POST request to the server
    return this.apiservice.post(`cities`, body, headers).pipe(
      tap((error: any) => {
        console.log('Response received:', error);
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
      // Log the user out and navigate to sign-in page
      this.jwtService.clearStorage(); // Clear token (implement this method in your JwtService)
      this.router.navigate(['/sign_in']); // Navigate to home route
      alert(errorMessage); // Show alert with error message
    } else if (error && error.message) {
      // Display error message
      // alert(errorMessage);
    }
  }
}
