import {
  Component,
  AfterViewInit,
  ElementRef,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    RouterLink,
    FooterComponent,
    NgOptimizedImage,
  ],
})
export class HomeComponent implements AfterViewInit {
  readonly videoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('heroVideo');
  readonly ctaVideoElement =
    viewChild.required<ElementRef<HTMLVideoElement>>('ctaVideo');

  ngAfterViewInit() {
    this.playVideo(this.videoElement());
    this.playVideo(this.ctaVideoElement());
  }

  private playVideo(videoRef: ElementRef<HTMLVideoElement>) {
    const video = videoRef?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch((error) => {
        console.log('Autoplay was prevented.', error);
      });
    }
  }
}
