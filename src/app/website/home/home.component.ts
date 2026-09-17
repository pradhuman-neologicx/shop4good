import {
  Component,
  ChangeDetectionStrategy,
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
export class HomeComponent {}
