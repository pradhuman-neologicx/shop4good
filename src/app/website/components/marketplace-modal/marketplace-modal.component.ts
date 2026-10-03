import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, DestroyRef, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MarketplaceService } from '../../../core/services/marketplace.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface Marketplace {
  name: string;
  src: string;
  description?: string;
  url?: string;
}

@Component({
  selector: 'app-marketplace-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marketplace-modal.component.html',
  styleUrl: './marketplace-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketplaceModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() marketplaces: Marketplace[] = [];
  @Output() closeModal = new EventEmitter<void>();

  apiMarketplaces: any[] = [];
  isLoading = false;
  loaded = false;

  private destroyRef = inject(DestroyRef);

  constructor(private marketplaceService: MarketplaceService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && !this.loaded) {
      this.loadMarketplaces();
    }
  }

  loadMarketplaces() {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.marketplaceService.getWebsiteMarketplaces().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data && res.data.items) {
          this.apiMarketplaces = res.data.items.map((item: any) => ({
            name: item.name,
            src: item.logo_url || '',
            description: item.short_description || '',
            url: item.website_url || '#'
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

  get displayMarketplaces(): any[] {
    return this.apiMarketplaces.length > 0 ? this.apiMarketplaces : this.marketplaces;
  }

  onClose() {
    this.closeModal.emit();
  }
}
