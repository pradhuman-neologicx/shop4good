import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { JwtService } from 'src/app/core/services/jwt.service';
import { CustomerProfileService } from 'src/app/core/services/customer-profile.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [RouterLink, NgOptimizedImage, CommonModule],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  forceScrolled = false;
  currentUser: any = null;
  isProfileMenuOpen = false;
  activeDropdown: string | null = null;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef, 
    private jwtService: JwtService,
    private customerProfileService: CustomerProfileService
  ) { }

  ngOnInit() {
    this.checkAuth();
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkAuth();
        this.checkRoute(event.urlAfterRedirects);
        this.closeMenu();
        this.cdr.detectChanges();
      });
  }

  private checkAuth() {
    if (this.jwtService.getCustomerIsLoggedIn()) {
      this.currentUser = this.jwtService.getCustomerData();
    } else {
      this.currentUser = null;
    }
  }

  logout() {
    this.customerProfileService.logout().pipe(take(1)).subscribe({
      next: () => {
        this.clearAndRedirect();
      },
      error: () => {
        // Still clear and redirect even if API fails, ensuring user gets logged out locally
        this.clearAndRedirect();
      }
    });
  }

  private clearAndRedirect() {
    this.jwtService.clearCustomerStorage();
    this.currentUser = null;
    this.closeMenu();
    this.router.navigate(['/auth/login']);
  }

  private checkRoute(url: string) {
    const staticRoutes = ['/contact', '/auth/login'];
    this.forceScrolled = staticRoutes.some((route) => url.includes(route));
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  openDropdown(name: string) {
    this.activeDropdown = name;
  }

  closeDropdown(name?: string) {
    if (!name || this.activeDropdown === name) {
      this.activeDropdown = null;
    }
  }

  toggleDropdown(name: string) {
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.activeDropdown = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
