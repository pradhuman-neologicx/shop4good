import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgOptimizedImage],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  contactInfo = [
    {
      icon: 'fa-solid fa-phone',
      title: 'Support Desk',
      detail: '0800 123 4567',
      href: 'tel:+4408001234567',
    },
    {
      icon: 'fa-solid fa-envelope',
      title: 'Email Us',
      detail: 'support@shop4good.com',
      href: 'mailto:support@shop4good.com',
    },
    {
      icon: 'fa-solid fa-location-dot',
      title: 'Headquarters',
      detail: `123 Goodness Lane \n London, UK`,
      href: '#',
    },
  ];

  quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Our Causes', href: '/causes' },
    { label: 'Marketplaces', href: '/marketplaces' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Admin Login', href: '/admin/login' },
  ];

  socials = [
    { icon: 'fab fa-facebook-f', href: '#' },
    { icon: 'fab fa-instagram', href: '#' },
    { icon: 'fab fa-twitter', href: '#' },
    { icon: 'fab fa-linkedin-in', href: '#' },
  ];
}
