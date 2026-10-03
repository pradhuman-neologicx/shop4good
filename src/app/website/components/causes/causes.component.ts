
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnInit,
  DestroyRef,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarketplaceModalComponent, Marketplace } from '../marketplace-modal/marketplace-modal.component';
import { CausesService } from '../../../core/services/causes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-causes',
  standalone: true,
  imports: [RouterLink, MarketplaceModalComponent],
  templateUrl: './causes.component.html',
  styleUrl: './causes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CausesComponent implements OnInit {
  causes: any[] = [];
  isMarketplaceOpen = false;
  marketplaces: Marketplace[] = [];
  isLoading = true;

  @ViewChild('causesSlider') causesSlider!: ElementRef<HTMLDivElement>;

  private destroyRef = inject(DestroyRef);

  // Array of aesthetic colors and icons to assign to causes
  private colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9', '#14b8a6'];
  private icons = ['📚', '🌱', '🏥', '🍲', '🐾', '💧', '🤝', '🌍'];

  constructor(private causesService: CausesService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCauses();
  }

  loadCauses() {
    this.isLoading = true;
    this.causesService.getWebsiteCauses({ limit: 8 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data && res.data.items) {
          this.causes = res.data.items.map((item: any, index: number) => ({
            id: item.id,
            title: item.name,
            slug: item.slug,
            description: item.short_description,
            image: item.cover_image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
            color: this.colors[index % this.colors.length],
            icon: this.icons[index % this.icons.length]
          }));
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

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

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
