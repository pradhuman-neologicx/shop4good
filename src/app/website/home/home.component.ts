import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { HeroComponent } from '../components/hero/hero.component';
import { NgoImpactComponent } from '../components/ngo-impact/ngo-impact.component';
import { FaqComponent } from '../components/faq/faq.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    RouterLink,
    FooterComponent,
    HeroComponent,
    NgoImpactComponent,
    FaqComponent,
  ],
})
export class HomeComponent {
  brandLogos = [
    { name: 'Amazon', src: 'assets/brands/amazon.svg' },
    { name: 'Flipkart', src: 'assets/brands/flipkart.svg' },
    { name: 'Myntra', src: 'assets/brands/myntra.svg' },
    { name: 'Ajio', src: 'assets/brands/ajio.svg' },
    { name: 'Nykaa', src: 'assets/brands/nykaa.svg' },
    { name: 'Meesho', src: 'assets/brands/meesho.svg' },
  ];
}

