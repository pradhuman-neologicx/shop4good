import { NgOptimizedImage } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ngo-impact',
  templateUrl: './ngo-impact.component.html',
  styleUrl: './ngo-impact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class NgoImpactComponent {
  features = [
    { icon: 'fa-solid fa-hand-holding-dollar', text: 'No Extra Cost Ever' },
    { icon: 'fa-solid fa-heart-circle-check', text: 'Choose Any Cause' },
    { icon: 'fa-solid fa-shield-heart', text: 'Verified NGOs Only' },
    { icon: 'fa-solid fa-shirt', text: 'Wear Your Impact' },
  ];

  impactPoints = [
    { title: 'Shop as usual', desc: 'Browse and shop from your favorite partner brands with zero markup.', icon: '🛍️' },
    { title: 'Automatic Donations', desc: 'A portion of your purchase is automatically donated at no extra cost.', icon: '💸' },
    { title: 'Choose your cause', desc: 'Direct your impact to the charities and Causes you care about most.', icon: '🎯' },
    { title: 'Track your impact', desc: 'See exactly how much you have raised and the lives you have touched.', icon: '📊' },
    { title: 'Verified NGOs', desc: 'We only partner with trusted, fully vetted organizations to ensure transparency.', icon: '✅' },
    { title: 'Community driven', desc: 'Join thousands of shoppers making a collective difference every day.', icon: '🤝' },
  ];
}
