import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent implements OnInit {
  steps: StepItem[] = [
    {
      number: '01',
      title: 'Choose your cause',
      description: 'Pick an NGO or cause you care about from our verified directory — education, environment, health and more.'
    },
    {
      number: '02',
      title: 'Shop as usual',
      description: 'Browse and buy on Flipkart, Amazon, Myntra, Nykaa and 20+ more platforms through our affiliate links.'
    },
    {
      number: '03',
      title: 'We donate 2%',
      description: 'We collect the affiliate commission and send 2% of your purchase value directly to your chosen cause.'
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
