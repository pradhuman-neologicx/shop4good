import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ngo-impact',
  templateUrl: './ngo-impact.component.html',
  styleUrl: './ngo-impact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class NgoImpactComponent {
  features = [
    { icon: 'fa-solid fa-hand-holding-dollar', text: 'No Extra Cost Ever' },
    { icon: 'fa-solid fa-heart-circle-check', text: 'Choose Any Cause' },
    { icon: 'fa-solid fa-shield-heart', text: 'Verified NGOs Only' },
    { icon: 'fa-solid fa-shirt', text: 'Wear Your Impact' },
  ];

  ngos = [
    { name: 'Smile Foundation', icon: 'fa-solid fa-face-smile' },
    { name: 'CRY India', icon: 'fa-solid fa-children' },
    { name: 'Goonj', icon: 'fa-solid fa-hand-holding-heart' },
    { name: 'Teach For India', icon: 'fa-solid fa-graduation-cap' },
    { name: 'Akshaya Patra', icon: 'fa-solid fa-bowl-food' },
    { name: 'HelpAge India', icon: 'fa-solid fa-person-cane' },
  ];
}
