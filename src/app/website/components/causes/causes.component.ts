import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketplaceModalComponent, Marketplace } from '../marketplace-modal/marketplace-modal.component';

@Component({
  selector: 'app-causes',
  standalone: true,
  imports: [RouterLink, MarketplaceModalComponent, NgOptimizedImage],
  templateUrl: './causes.component.html',
  styleUrl: './causes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CausesComponent {
  causes = [
    {
      id: 'education',
      title: 'Education for All',
      description: 'Support schools and provide learning materials to underprivileged children.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop',
      color: '#3b82f6',
      icon: '📚',
      slug: 'educare-global'
    },
    {
      id: 'environment',
      title: 'Environmental Conservation',
      description: 'Fund tree planting and ocean cleanup initiatives to protect our planet.',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop',
      color: '#10b981',
      icon: '🌱',
      slug: 'green-earth-foundation'
    },
    {
      id: 'health',
      title: 'Healthcare Access',
      description: 'Help provide essential medical care and supplies to communities in need.',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070&auto=format&fit=crop',
      color: '#ef4444',
      icon: '🏥',
      slug: 'health-for-all'
    },
    {
      id: 'hunger',
      title: 'Zero Hunger',
      description: 'Support food banks and nutritional programs for vulnerable populations.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
      color: '#f59e0b',
      icon: '🍲',
      slug: 'health-for-all' // Reusing a mock NGO
    },
    {
      id: 'animals',
      title: 'Animal Welfare',
      description: 'Protect endangered species and support local animal shelters and rescues.',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=2071&auto=format&fit=crop',
      color: '#8b5cf6',
      icon: '🐾',
      slug: 'paws-and-claws-rescue'
    }
  ];

  isMarketplaceOpen = false;
  
  marketplaces: Marketplace[] = [
    { name: 'Amazon', src: 'assets/brands/amazon.svg', description: 'Up to 5% donation' },
    { name: 'Flipkart', src: 'assets/brands/flipkart.svg', description: 'Up to 3% donation' },
    { name: 'Myntra', src: 'assets/brands/myntra.svg', description: 'Up to 4% donation' },
    { name: 'Tata Cliq', src: 'assets/brands/tata-cliq.svg', description: 'Up to 6% donation' },
    { name: 'Nykaa', src: 'assets/brands/nykaa.svg', description: 'Up to 2% donation' },
    { name: 'Meesho', src: 'assets/brands/meesho.svg', description: 'Up to 1% donation' },
  ];

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  @ViewChild('causesSlider') causesSlider!: ElementRef<HTMLDivElement>;

  scrollCauses(direction: 'left' | 'right') {
    if (!this.causesSlider) return;
    const scrollAmount = 380;
    const el = this.causesSlider.nativeElement;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}
