import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export interface ImpactMetric {
  value: string;
  label: string;
}

export interface YearlyData {
  year: string;
  value: string;
  heightPercent: number;
  barClass: string;
}

export interface CauseBreakdown {
  name: string;
  percent: number;
  barColor: string;
  iconBg: string;
  iconColor: string;
  iconType: 'book' | 'heart' | 'home' | 'paw';
}

@Component({
  selector: 'app-our-impact',
  standalone: true,
  imports: [CommonModule,  NavbarComponent, FooterComponent],
  templateUrl: './our-impact.component.html',
  styleUrl: './our-impact.component.scss'
})
export class OurImpactComponent implements OnInit {
  metrics: ImpactMetric[] = [
    { value: '₹24.5L+', label: 'Total donated' },
    { value: '25,200+', label: 'Lives impacted' },
    { value: '150+', label: 'Communities supported' },
    { value: '4', label: 'Causes' }
  ];

  yearlyImpact: YearlyData[] = [
    { year: '2023', value: '2.1K', heightPercent: 24, barClass: 'bg-slate-200' },
    { year: '2024', value: '5.4K', heightPercent: 46, barClass: 'bg-emerald-100' },
    { year: '2025', value: '8.8K', heightPercent: 72, barClass: 'bg-emerald-200' },
    { year: '2026', value: '12.9K', heightPercent: 100, barClass: 'bg-[#087F6A]' }
  ];

  causeBreakdowns: CauseBreakdown[] = [
    {
      name: 'Kids Education',
      percent: 42,
      barColor: '#37426F',
      iconBg: '#EEF2FF',
      iconColor: '#37426F',
      iconType: 'book'
    },
    {
      name: 'Women Empowerment',
      percent: 28,
      barColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconColor: '#E11D48',
      iconType: 'heart'
    },
    {
      name: 'Senior Citizen Care',
      percent: 18,
      barColor: '#334155',
      iconBg: '#F1F5F9',
      iconColor: '#334155',
      iconType: 'home'
    },
    {
      name: 'Pet Care',
      percent: 12,
      barColor: '#087F6A',
      iconBg: '#E6F4F1',
      iconColor: '#087F6A',
      iconType: 'paw'
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
