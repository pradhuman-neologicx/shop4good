import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-new.component.html',
  styleUrl: './hero-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroNewComponent implements OnInit, OnDestroy {
  // ─── Desktop Images ───
  desktopLeftImage = 'assets/images/hero/header_1.png';
  
  desktopRightImages: string[] = [
    'assets/images/hero/header_6.png',
    'assets/images/hero/header_5.png',
    'assets/images/hero/header_4.png',
    'assets/images/hero/header_2.png',
  ];

 
  mobileLeftImage = 'assets/images/hero/mobileheader_1.png'; 
  
  mobileRightImages: string[] = [
    'assets/images/hero/mobileheader_6.png',
    'assets/images/hero/mobileheader_4.png',
    'assets/images/hero/mobileheader_3.png',
    'assets/images/hero/mobileheader_2.png',
  ];
  
  currentIndex = 0;
  isMobile = false;
  private intervalId: any;

  // Backward compatibility
  get leftImage(): string {
    return this.isMobile ? this.mobileLeftImage : this.desktopLeftImage;
  }
  
  get rightImages(): string[] {
    return this.isMobile ? this.mobileRightImages : this.desktopRightImages;
  }

  get currentLeftImage(): string {
    return this.isMobile ? this.mobileLeftImage : this.desktopLeftImage;
  }

  get currentRightImages(): string[] {
    return this.isMobile ? this.mobileRightImages : this.desktopRightImages;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      window.addEventListener('resize', this.onResize);
      this.startSlider();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
    }
  }

  private onResize = () => {
    this.checkScreenSize();
  };

  private checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    if (wasMobile !== this.isMobile) {
      this.currentIndex = 0;
    }
    this.cdr.markForCheck();
  }

  private startSlider() {
    this.intervalId = setInterval(() => {
      const activeList = this.isMobile ? this.mobileRightImages : this.desktopRightImages;
      const total = activeList.length || 1;
      this.currentIndex = (this.currentIndex + 1) % total;
      this.cdr.markForCheck();
    }, 3000);
  }
}

