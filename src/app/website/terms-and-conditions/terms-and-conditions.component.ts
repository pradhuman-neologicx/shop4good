import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export interface TermsSection {
  number: number;
  title: string;
  description: string;
  bullets?: string[];
}

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
  ],
})
export class TermsAndConditionsComponent {
  lastUpdated: string = '11 October 2026';

  sections: TermsSection[] = [
    {
      number: 1,
      title: 'Acceptance of Terms',
      description: 'By accessing and using the Shop4Good platform, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website or services.'
    },
    {
      number: 2,
      title: 'How the Service Works',
      description: 'Shop4Good acts as an affiliate and social impact platform connecting conscious shoppers with trusted retail partners and verified charities:',
      bullets: [
        'We provide verified and tracked links to our partner brands and online marketplaces.',
        'When you make a qualifying purchase via our link, the retailer provides us with an affiliate commission.',
        'We donate a designated percentage of that commission to the charitable cause selected in your account profile.',
        'We are not responsible for direct fulfillment, delivery, quality, returns, or warranty of third-party retail purchases.'
      ]
    },
    {
      number: 3,
      title: 'User Accounts & Responsibilities',
      description: 'To choose causes, monitor donation history, and receive impact badges, you need to register for an account:',
      bullets: [
        'You are solely responsible for maintaining the confidentiality and safety of your login credentials.',
        'You agree to provide authentic, up-to-date, and accurate information during registration.',
        'We reserve the right to suspend or terminate any account involved in fraudulent behavior, abuse, or unauthorized automated activities.'
      ]
    },
    {
      number: 4,
      title: 'Charitable Donations & Distributions',
      description: 'Donations are calculated strictly based on the net commission received by Shop4Good, rather than total checkout cost. Commission percentages vary by brand partner and item category. Donations are confirmed once the retailer’s return window expires, and disbursed to our non-profit partners on consistent quarterly cycles.'
    },
    {
      number: 5,
      title: 'Third-Party Links & Merchant Policies',
      description: 'Our platform contains links to external online retailers. Once redirected, you are governed by the third-party merchant’s specific terms, privacy statements, and customer service conditions. Shop4Good has no control over and assumes no liability for external merchants.'
    },
    {
      number: 6,
      title: 'Limitation of Liability',
      description: 'Shop4Good provides services on an "as is" and "as available" basis without express or implied warranties. To the fullest extent permitted by applicable laws, we shall not be liable for any incidental, indirect, or consequential damages resulting from platform use or third-party retailer interactions.'
    },
    {
      number: 7,
      title: 'Updates & Modifications',
      description: 'We may modify or revise these Terms at any time to reflect updates to our platform, changes in law, or operational improvements. Continued usage of Shop4Good following any revisions constitutes your acceptance of the new Terms.'
    }
  ];
}
