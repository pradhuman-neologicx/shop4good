import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { NotificationService } from '../services/notificationnew.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate {

  constructor(
    private authService: JwtService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.getCustomerIsLoggedIn()) {
      return true;
    } else {
      this.notification.show('Please log in to start shopping.', 'info');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
