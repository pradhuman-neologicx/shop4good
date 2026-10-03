import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Cause {
  id?: number;
  cause_code?: string;
  name: string;
  slug?: string;
  short_description: string;
  description?: string | null;
  cover_image_url?: string | null;
  images?: any[];
  goal_amount: number;
  raised_amount?: number;
  progress_percent?: number;
  is_active?: boolean;
  is_featured?: boolean;
  status?: string;
  sort_order?: number;
  starts_at?: string | null;
  ends_at?: string | null;
  created_by?: number | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CausesResponse {
  status: number;
  message: string;
  data: {
    items: Cause[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class CausesService {

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // --- ADMIN APIs ---

  getAdminCauses(params?: any): Observable<any> {
    let queryString = this.buildQueryString(params);
    return this.apiService.get(`admin/causes${queryString}`, { headers: this.getHeaders() });
  }

  getAdminCauseById(id: number): Observable<any> {
    return this.apiService.get(`admin/causes/${id}`, { headers: this.getHeaders() });
  }

  addAdminCause(data: any): Observable<any> {
    return this.apiService.post(`admin/causes`, data, { headers: this.getHeaders() });
  }

  updateAdminCause(id: number, data: any): Observable<any> {
    return this.apiService.post(`admin/causes/${id}`, data, { headers: this.getHeaders() });
  }

  toggleAdminCauseStatus(id: number, statusData: any): Observable<any> {
    return this.apiService.patch(`admin/causes/${id}/status`, statusData, { headers: this.getHeaders() });
  }

  deleteAdminCause(id: number): Observable<any> {
    return this.apiService.deleteFun(`admin/causes/${id}`, { headers: this.getHeaders() });
  }


  // --- WEBSITE APIs ---

  getWebsiteCauses(params?: any): Observable<any> {
    let queryString = this.buildQueryString(params);
    return this.apiService.get(`causes${queryString}`); 
  }

  getWebsiteCauseDetails(id: number | string): Observable<any> {
    return this.apiService.get(`causes/${id}`);
  }

  // --- Helper Methods ---

  private buildQueryString(params: any): string {
    if (!params) return '';
    let queryParams = [];
    for (let key in params) {
      if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== undefined && params[key] !== '') {
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
      }
    }
    return queryParams.length > 0 ? '?' + queryParams.join('&') : '';
  }
}
