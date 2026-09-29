import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Ngo, MOCK_NGOS } from '../ngo-mock-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MarketplaceModalComponent, Marketplace } from '../../components/marketplace-modal/marketplace-modal.component';

@Component({
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, MarketplaceModalComponent, NgOptimizedImage],
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

  causeDetail: any = null;
  selectedImageIndex = 0;

  constructor(private route: ActivatedRoute) {}

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.ngo = MOCK_NGOS.find(n => n.slug === slug);
        if (this.ngo && this.ngo.causeDetail) {
          this.causeDetail = this.ngo.causeDetail;
        } else {
          // Fallback if causeDetail doesn't exist for a particular NGO
          this.causeDetail = {
            name: this.ngo?.name + " Cause",
            description: this.ngo?.longDescription || "",
            goal_amount: 500000,
            raised_amount: 0,
            is_active: true,
            is_featured: true,
            sort_order: 1,
            starts_at: "2026-01-01",
            ends_at: "2026-12-31",
            images: [
              'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
            ]
          };
        }
      }
    });
  }
}
