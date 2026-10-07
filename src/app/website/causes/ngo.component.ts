import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { MarketplaceModalComponent, Marketplace } from '../components/marketplace-modal/marketplace-modal.component';
import { CausesService, Cause } from '../../core/services/causes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent, MarketplaceModalComponent, NgOptimizedImage, NgSelectModule],
  selector: 'app-ngo',
  styleUrl: './ngo.component.scss',
  templateUrl: './ngo.component.html',
})
export class NgoComponent implements OnInit {
  allNgos: any[] = [];
  filteredNgos: any[] = [];
  
  // Filters
  searchQuery: string = '';
  selectedCauses: string[] = [];
  
  // Available causes for filter
  availableCauses: string[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(private causesService: CausesService) {}

  isMarketplaceOpen = false;
  marketplaces: Marketplace[] = [];
  isLoading = true;

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  ngOnInit() {
    this.loadCauses();
  }

  loadCauses() {
    this.isLoading = true;
    this.causesService.getWebsiteCauses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 200 && res.data && res.data.items) {
          const allTags = new Set<string>();

          this.allNgos = res.data.items.map((item: any) => {
            const rawTags = Array.isArray(item.tags) ? item.tags : (item.tags_string ? item.tags_string.split(',').map((t:string) => t.trim()) : []);
            rawTags.forEach((t:string) => {
              if (t) allTags.add(t);
            });
            
            return {
              id: item.id,
              name: item.name,
              slug: item.slug,
              shortDescription: item.short_description,
              description: item.description,
              coverImage: item.cover_image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop',
              logo: 'https://images.unsplash.com/photo-1531206715517-5c0bf140bd33?q=80&w=200&auto=format&fit=crop',
              causes: rawTags
            };
          });
          
          this.availableCauses = Array.from(allTags).sort();
          this.filteredNgos = [...this.allNgos];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching causes:', err);
      }
    });
  }

  toggleCause(cause: string) {
    const index = this.selectedCauses.indexOf(cause);
    if (index > -1) {
      this.selectedCauses.splice(index, 1);
    } else {
      this.selectedCauses.push(cause);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredNgos = this.allNgos.filter(ngo => {
      // Check search query
      const matchesSearch = this.searchQuery === '' || 
        ngo.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ngo.shortDescription.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Check causes
      const matchesCauses = this.selectedCauses.length === 0 || 
        this.selectedCauses.some(selectedCause => ngo.causes.includes(selectedCause));

      return matchesSearch && matchesCauses;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCauses = [];
    this.applyFilters();
  }
}
