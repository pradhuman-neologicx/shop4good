import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
// import { HeaderSectionComponent } from '../components/header-section/header-section.component';
// import { RouterLink } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    // HeaderSectionComponent,
    // RouterLink,
    FooterComponent,
  ],
})
export class PrivacyPolicyComponent {}
