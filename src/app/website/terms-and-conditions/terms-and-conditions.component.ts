import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
// import { HeaderSectionComponent } from '../components/header-section/header-section.component';
// import { RouterLink } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    // HeaderSectionComponent,
    // RouterLink,
    FooterComponent,
  ],
})
export class TermsAndConditionsComponent {}
