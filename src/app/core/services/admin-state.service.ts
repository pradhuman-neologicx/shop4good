import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AdminStateService {
  // Signals for state management
  private _theme = signal<'light' | 'dark'>('light');
  private _isMobile = signal<boolean>(false);
  private _collapsed = signal<boolean>(false);
  private _sidenavOpened = signal<boolean>(false);
  private _themeSectionOpen = signal<boolean>(false);

  // Computed properties
  theme = this._theme.asReadonly();
  isMobile = this._isMobile.asReadonly();
  collapsed = this._collapsed.asReadonly();
  sidenavOpened = this._sidenavOpened.asReadonly();
  themeSectionOpen = this._themeSectionOpen.asReadonly();
  
  sidenavMode = computed(() => this._isMobile() ? 'over' : 'side');
  contentMargin = computed(() => {
    if (this._isMobile()) return '0';
    return this._collapsed() ? '95px' : '236px';
  });
  sidenavWidth = computed(() => this._collapsed() ? '73px' : '220px');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this._theme.set(savedTheme);
    }
  }

  setTheme(theme: 'light' | 'dark') {
    this._theme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
  }

  toggleThemeSection() {
    this._themeSectionOpen.update(v => !v);
  }

  setThemeSectionOpen(isOpen: boolean) {
    this._themeSectionOpen.set(isOpen);
  }

  checkScreenSize(innerWidth: number) {
    const isMob = innerWidth <= 768;
    this._isMobile.set(isMob);
    
    if (isMob) {
      this._sidenavOpened.set(false);
    } else {
      this._sidenavOpened.set(true);
    }
  }

  setSidenavOpened(isOpen: boolean) {
    this._sidenavOpened.set(isOpen);
  }

  toggleCollapsed() {
    if (this._isMobile()) {
      this._sidenavOpened.update(v => !v);
    } else {
      this._collapsed.update(v => !v);
    }
  }
}
