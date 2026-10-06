import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  id: number;
  image: string;
  mobileImage?: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  // imports: [RouterLink],
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private autoplayInterval: ReturnType<typeof setInterval> | null = null;
  private readonly AUTOPLAY_DELAY = 5000;

  slides: HeroSlide[] = [
    {
      id: 1,
      image: 'assets/images/hero/hero1.png',
      mobileImage: 'assets/images/hero/hero1-mobile.png',
      titleLine1: 'The Goods Are For You,',
      titleAccent: 'The Good Is For Them',
      description:
        'Because when you shop, you build a better future for someone else. Every purchase makes a difference.',
    },
    {
      id: 2,
      image: 'assets/images/hero/hero2.png',
      mobileImage: 'assets/images/hero/hero2-mobile.png',
      titleLine1: 'Shop Your Favorite Brands,',
      titleAccent: 'Support Your Causes',
      description:
        'Turn your everyday shopping into meaningful impact. No extra cost, just pure goodness.',
    },
    {
      id: 3,
      image: 'assets/images/hero/hero3.png',
      mobileImage: 'assets/images/hero/hero3-mobile.png',
      titleLine1: 'Every Purchase Counts,',
      titleAccent: 'Every Cause Matters',
      description:
        'Join thousands of shoppers who are already making a difference through Shop4Good.',
    },
    {
      id: 4,
      image: 'assets/images/hero/hero4.png',
      mobileImage: 'assets/images/hero/hero4-mobile.png',
      titleLine1: 'It’s Not Just Shopping.',
      titleAccent: 'It’s Sharing the Good.',
      description:
        'We’re a place where your purchases create change and your values shape the future.',
    },
  ];

  // Repeat marquee items for seamless scroll
  marqueeItems = Array(10).fill(null);

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartAutoplay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  private startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.AUTOPLAY_DELAY);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
