import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  shopLinks = [
    { label: 'All Brands', href: '/shop' },
  ];

  causeLinks = [
    { label: 'Kids Education', href: '/causes-new/kids' },
    { label: 'Women Empowerment', href: '/causes-new/women' },
    { label: 'Senior Citizen Care', href: '/causes-new/senior' },
    { label: 'Pet Care', href: '/causes-new/pets' },
  ];

  aboutLinks = [
    { label: 'Our Story', href: '/about/our-story' },
    { label: 'How It Works', href: '/about/how-it-works' },
    { label: 'Our Impact', href: '/about/our-impact' },
    { label: 'Partner With Us', href: '/about/partner-with-us' },
  ];

  helpLinks = [
    { label: 'FAQs', href: '/help/faqs' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ];

  socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ];
}
