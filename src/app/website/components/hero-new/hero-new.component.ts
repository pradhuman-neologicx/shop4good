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
  leftImage = 'assets/images/hero/0.png';
  
  rightImages = [
    'assets/images/hero/1.png',
    'assets/images/hero/5.png',
    'assets/images/hero/4.png',
    'assets/images/hero/3.png',
  ];
  
  currentIndex = 0;
  private intervalId: any;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.rightImages.length;
        this.cdr.markForCheck();
      }, 3000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

