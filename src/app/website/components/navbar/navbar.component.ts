import { NgOptimizedImage, CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.checkAuth();
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkAuth();
        this.checkRoute(event.urlAfterRedirects);
        this.cdr.detectChanges();
      });
  }

  private checkAuth() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.isMenuOpen = false;
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
