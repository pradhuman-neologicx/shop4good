import { Component, HostListener, Inject, Renderer2, DOCUMENT, ChangeDetectionStrategy, OnInit, effect } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDrawerMode, MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SidenavHeaderComponent } from './sidenav-header/sidenav-header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RouterOutlet } from '@angular/router';
import { AdminStateService } from '../core/services/admin-state.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, SidenavHeaderComponent, MatSidenavContainer, MatSidenav, SidenavComponent, MatSidenavContent, SpinnerComponent, RouterOutlet]
})
export class AdminComponent implements OnInit {
  title = 'mat_admin';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private render: Renderer2,
    private overlay: OverlayContainer,
    public adminState: AdminStateService
  ) {
    // Effect to reactively update the body class based on theme signal
    effect(() => {
      const theme = this.adminState.theme();
      this.render.removeClass(this.document.body, 'lightTheme');
      this.render.removeClass(this.document.body, 'darkTheme');
      this.render.addClass(this.document.body, `${theme}Theme`);
    });
  }

  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang', selectedLanguage);
  }

  lang: string = '';

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    // Initial check for screen size on load
    if (typeof window !== 'undefined') {
      this.adminState.checkScreenSize(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adminState.checkScreenSize(event.target.innerWidth);
  }

  changeTheme(themevalue: 'light' | 'dark') {
    this.adminState.setTheme(themevalue);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.theme-change-section') &&
      !targetElement.closest('.setting-icon')
    ) {
      this.adminState.setThemeSectionOpen(false);
    }
  }
}
