import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { MarketplaceService } from '../../core/services/marketplace.service';

export interface BrandItem {
  id?: number | string;
  name: string;
  src: string;
  description?: string;
  url: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ShopComponent implements OnInit {
  isLoading = false;
  loaded = false;
  searchQuery: string = '';
  selectedBrand: BrandItem | null = null;
  marketplaces: BrandItem[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private marketplaceService: MarketplaceService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMarketplaces();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadMarketplaces(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.marketplaceService.getWebsiteMarketplaces().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data.items)) {
          this.marketplaces = res.data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            src: this.getBrandLogo(item.name, item.logo_url),
            description: item.short_description || item.description || '',
            url: item.website_url || item.affiliate_url || '#'
          }));
          this.loaded = true;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private getBrandLogo(name: string, apiLogo?: string): string {
    if (apiLogo && apiLogo.trim().length > 0) {
      return apiLogo;
    }
    const cleanName = (name || '').toLowerCase().trim();
    if (cleanName.includes('amazon')) return 'assets/brands/amazon.svg';
    if (cleanName.includes('flipkart')) return 'assets/brands/flipkart.svg';
    if (cleanName.includes('tata') || cleanName.includes('cliq')) return 'assets/brands/tata-cliq.svg';
    if (cleanName.includes('nykaa')) return 'assets/brands/nykaa.svg';
    if (cleanName.includes('myntra')) return 'assets/brands/myntra.svg';
    if (cleanName.includes('ajio')) return 'assets/brands/ajio.svg';
    if (cleanName.includes('meesho')) return 'assets/brands/meesho.svg';
    return 'assets/logo.png';
  }

  get filteredMarketplaces(): BrandItem[] {
    if (!this.searchQuery.trim()) {
      return this.marketplaces;
    }
    const q = this.searchQuery.toLowerCase().trim();
    return this.marketplaces.filter(item => 
      item.name.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q))
    );
  }

  selectBrand(brand: BrandItem): void {
    if (this.selectedBrand?.name === brand.name) {
      this.selectedBrand = null;
    } else {
      this.selectedBrand = brand;
    }
  }

  openBrandUrl(brand: BrandItem, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedBrand = brand;
    if (brand.url && brand.url !== '#') {
      if (typeof window !== 'undefined') {
        window.open(brand.url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  startShopping(): void {
    const target = this.selectedBrand || (this.filteredMarketplaces.length > 0 ? this.filteredMarketplaces[0] : null);
    if (target && target.url && target.url !== '#') {
      if (typeof window !== 'undefined') {
        window.open(target.url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  onImageError(event: Event, brand: BrandItem): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('logo.png')) {
      target.src = 'assets/logo.png';
    }
  }
}
