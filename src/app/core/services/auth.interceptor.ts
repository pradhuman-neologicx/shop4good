import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // If the request already has an Authorization header (e.g., explicitly set by a service), don't overwrite it
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // Otherwise, determine which token to use based on the API URL
    let token = null;
    
    // If the URL contains '/admin/', it's an admin panel request
    if (req.url.includes('/admin/')) {
      token = this.jwtService.getToken(); // Admin token
    } else {
      // Otherwise it's a customer-facing API request
      token = this.jwtService.getCustomerToken(); // Customer token
    }
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}
