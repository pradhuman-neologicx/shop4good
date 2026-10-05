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
  leftImage = 'assets/images/hero/Good Shopping Side.png';
  
  rightImages = [
    'assets/images/hero/Dog.png',
    'assets/images/hero/Kid.png',
    'assets/images/hero/Old Age.png',
    'assets/images/hero/Women_.png'
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

