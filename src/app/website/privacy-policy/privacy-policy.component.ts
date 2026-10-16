import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export interface PolicySection {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
  ],
})
export class PrivacyPolicyComponent {
  lastUpdated: string = '11 October 2026';

  sections: PolicySection[] = [
    {
      number: 1,
      title: 'Information we collect',
      description: 'We collect information you provide directly to us, such as your name, email address, phone number and order details.'
    },
    {
      number: 2,
      title: 'How we use your information',
      description: 'We use your information to process orders, share impact updates, improve our services and communicate with you.'
    },
    {
      number: 3,
      title: 'Data protection',
      description: 'We implement industry-standard security measures to keep your information safe.'
    },
    {
      number: 4,
      title: 'Sharing your information',
      description: 'We do not sell your personal information. We only share it with trusted partners necessary to provide our services (e.g., brand partners, payment providers).'
    },
    {
      number: 5,
      title: 'Your rights',
      description: 'You can access, update or delete your personal information by contacting us at support@shop4good.com.'
    }
  ];
}
