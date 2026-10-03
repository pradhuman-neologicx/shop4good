import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export interface Marketplace {
  id?: number;
  marketplace_code?: string;
  name: string;
  slug?: string;
  short_description?: string;
  description?: string | null;
  logo_url?: string | null;
  website_url: string;
  domain?: string;
  country_code?: string;
  currency?: string;
  is_active?: boolean;
  is_featured?: boolean;
  status?: string;
  sort_order?: number;
  affiliate_config?: any;
  created_by?: number | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MarketplacesResponse {
  status: number;
  message: string;
  data: {
    items: Marketplace[];
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
export class MarketplaceService {

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

  private buildQueryString(params?: any): string {
    if (!params) return '';
    const query = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    return query ? `?${query}` : '';
  }

  // --- ADMIN APIs ---

  getAdminMarketplaces(params?: any): Observable<any> {
    let queryString = this.buildQueryString(params);
    return this.apiService.get(`admin/marketplaces${queryString}`, { headers: this.getHeaders() });
  }

  getAdminMarketplaceById(id: number): Observable<any> {
    return this.apiService.get(`admin/marketplaces/${id}`, { headers: this.getHeaders() });
  }

  addAdminMarketplace(data: any): Observable<any> {
    return this.apiService.post(`admin/marketplaces`, data, { headers: this.getHeaders() });
  }

  updateAdminMarketplace(id: number, data: any): Observable<any> {
     return this.apiService.post(`admin/marketplaces/${id}`, data, { headers: this.getHeaders() });
  }

  toggleAdminMarketplaceStatus(id: number, statusData: any): Observable<any> {
    return this.apiService.patch(`admin/marketplaces/${id}/status`, statusData, { headers: this.getHeaders() });
  }

  deleteAdminMarketplace(id: number): Observable<any> {
    return this.apiService.deleteFun(`admin/marketplaces/${id}`, { headers: this.getHeaders() });
  }

  // --- WEBSITE APIs ---

  getWebsiteMarketplaces(params?: any): Observable<any> {
    let queryString = this.buildQueryString(params);
    return this.apiService.get(`marketplaces${queryString}`); 
  }
}
