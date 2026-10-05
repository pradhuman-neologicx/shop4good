
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  inject,
  DestroyRef
} from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../components/footer/footer.component';
import { HeroComponent } from '../components/hero/hero.component';
import { NgoImpactComponent } from '../components/ngo-impact/ngo-impact.component';
import { FaqComponent } from '../components/faq/faq.component';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CausesNewComponent } from '../components/causes-new/causes-new.component';
import { HowWorksComponent } from '../components/how-works/how-works.component';
import { ImpactProofComponent } from '../components/impact-proof/impact-proof.component';
import { JwtService } from '../../core/services/jwt.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NavbarComponent,
    RouterLink,
    FooterComponent,
    HeroComponent,
    // NgoImpactComponent,
    FaqComponent,
    CausesNewComponent,
    HowWorksComponent,
    ImpactProofComponent],
})
export class HomeComponent implements OnInit {
  brandLogos: any[] = [];
  isLoadingBrands = true;
  isLoggedIn = false;
  private destroyRef = inject(DestroyRef);
  private jwtService = inject(JwtService);

  constructor(
    private marketplaceService: MarketplaceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.jwtService.getCustomerIsLoggedIn();
    this.loadMarketplaces();
  }

  loadMarketplaces() {
    this.isLoadingBrands = true;
    this.marketplaceService.getWebsiteMarketplaces({ limit: 6 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data && res.data.items) {
          this.brandLogos = res.data.items.map((item: any) => ({
            name: item.name,
            src: item.logo_url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
            url: item.affiliate_url || '#'
          }));
        }
        this.isLoadingBrands = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingBrands = false;
        this.cdr.markForCheck();
      }
    });
  }
}
