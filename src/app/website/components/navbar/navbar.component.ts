import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, NgOptimizedImage],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  forceScrolled = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects);
      });
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
