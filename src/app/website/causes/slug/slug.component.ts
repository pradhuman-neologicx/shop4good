import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Ngo, MOCK_NGOS } from '../ngo-mock-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MarketplaceModalComponent, Marketplace } from '../../components/marketplace-modal/marketplace-modal.component';

@Component({
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, MarketplaceModalComponent],
  selector: 'app-slug',
  styleUrl: './slug.component.scss',
  templateUrl: './slug.component.html',
})
export class SlugComponent implements OnInit {
  ngo: Ngo | undefined;
  
  isMarketplaceOpen = false;
  
  marketplaces: Marketplace[] = [
    { name: 'Amazon', src: 'assets/brands/amazon.svg', description: 'Up to 5% donation' },
    { name: 'Flipkart', src: 'assets/brands/flipkart.svg', description: 'Up to 3% donation' },
    { name: 'Myntra', src: 'assets/brands/myntra.svg', description: 'Up to 4% donation' },
    { name: 'Ajio', src: 'assets/brands/ajio.svg', description: 'Up to 6% donation' },
    { name: 'Nykaa', src: 'assets/brands/nykaa.svg', description: 'Up to 2% donation' },
    { name: 'Meesho', src: 'assets/brands/meesho.svg', description: 'Up to 1% donation' },
  ];

  constructor(private route: ActivatedRoute) {}

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.ngo = MOCK_NGOS.find(n => n.slug === slug);
      }
    });
  }
}
