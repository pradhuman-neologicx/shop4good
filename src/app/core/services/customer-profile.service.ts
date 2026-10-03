import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerProfileService {
  constructor(private apiService: ApiService, private jwtService: JwtService) {}



  private getFormDataHeaders(): HttpHeaders {
    const token = this.jwtService.getCustomerToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
      // Note: We don't set Content-Type here because FormData automatically sets it 
      // with the correct multipart/form-data boundary.
    });
  }

  getProfile(): Observable<any> {
    return this.apiService.get('profile', { headers: this.getFormDataHeaders() });
  }

  updateProfile(formData: FormData): Observable<any> {
    return this.apiService.post('profile', formData, { headers: this.getFormDataHeaders() });
  }

  changePassword(data: any): Observable<any> {
    return this.apiService.put('profile/password', data, { headers: this.getFormDataHeaders() });
  }

  logout(): Observable<any> {
    return this.apiService.post('auth/logout', {}, { headers: this.getFormDataHeaders() });
  }
}
