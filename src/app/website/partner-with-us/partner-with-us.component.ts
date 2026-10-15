import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export interface PartnerBenefit {
  title: string;
  description: string;
  icon: 'sparkles' | 'chart' | 'users' | 'link' | 'wallet' | 'shield';
}

@Component({
  selector: 'app-partner-with-us',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './partner-with-us.component.html',
  styleUrl: './partner-with-us.component.scss'
})
export class PartnerWithUsComponent implements OnInit {
  activeTab: 'brands' | 'ngos' = 'brands';

  brandBenefits: PartnerBenefit[] = [
    {
      title: 'Create meaningful impact',
      description: 'Support real causes through your brand.',
      icon: 'sparkles'
    },
    {
      title: 'Increase brand value',
      description: 'Be part of a trusted, purpose-driven platform.',
      icon: 'chart'
    },
    {
      title: 'Engage conscious customers',
      description: 'Reach a growing community of mindful shoppers.',
      icon: 'users'
    },
    {
      title: 'Easy integration',
      description: 'Simple, transparent onboarding and reporting.',
      icon: 'link'
    }
  ];

  ngoBenefits: PartnerBenefit[] = [
    {
      title: 'Reach more supporters',
      description: 'Get discovered by thousands of mindful shoppers.',
      icon: 'users'
    },
    {
      title: 'Steady, recurring funding',
      description: '2% of every order goes straight to your cause.',
      icon: 'wallet'
    },
    {
      title: 'Transparent impact reporting',
      description: 'Track donations and share results with your community.',
      icon: 'chart'
    },
    {
      title: 'Verified & trusted',
      description: 'A verified badge builds confidence with donors.',
      icon: 'shield'
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setTab(tab: 'brands' | 'ngos'): void {
    this.activeTab = tab;
  }
}
