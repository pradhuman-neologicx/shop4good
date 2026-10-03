import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  constructor(private apiService: ApiService) { }

  getStates(): Observable<any> {
    return this.apiService.get('states');
  }

  getCitiesByState(stateId: number): Observable<any> {
    return this.apiService.get(`states/${stateId}/cities`);
  }

  register(body: any): Observable<any> {
    return this.apiService.postWithoutHeader('auth/register', body);
  }

  customerLogin(body: any): Observable<any> {
    return this.apiService.postWithoutHeader('auth/login', body);
  }
}
