import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MarketplaceModalComponent, Marketplace } from '../../components/marketplace-modal/marketplace-modal.component';
import { CausesService } from '../../../core/services/causes.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject, ChangeDetectorRef } from '@angular/core';

@Component({
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, MarketplaceModalComponent, NgOptimizedImage],
  selector: 'app-slug',
  styleUrl: './slug.component.scss',
  templateUrl: './slug.component.html',
})
export class SlugComponent implements OnInit {
  ngo: any | undefined;
  isLoading: boolean = true;
  
  isMarketplaceOpen = false;
  
  marketplaces: Marketplace[] = [];

  causeDetail: any = null;
  selectedImageIndex = 0;

  copySuccess: boolean = false;
  private copyTimeout: any = null;

  private destroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute, private causesService: CausesService, private cdr: ChangeDetectorRef) {}

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  shareWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = this.causeDetail?.name || this.ngo?.name || 'Shop4Good';
    const text = `Support "${title}" on Shop4Good and help make a difference:\n${url}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  shareTwitter() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = this.causeDetail?.name || this.ngo?.name || 'Shop4Good';
    const text = `Support "${title}" on Shop4Good! Every contribution counts:`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  shareLinkedIn() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  copyLink() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.triggerCopiedState();
      }).catch(() => {
        this.fallbackCopyText(url);
      });
    } else {
      this.fallbackCopyText(url);
    }
  }

  private triggerCopiedState() {
    this.copySuccess = true;
    this.cdr.detectChanges();
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    this.copyTimeout = setTimeout(() => {
      this.copySuccess = false;
      this.cdr.detectChanges();
    }, 2500);
  }

  private fallbackCopyText(text: string) {
    if (typeof document === 'undefined') return;
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        this.triggerCopiedState();
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadCauseDetails(slug);
      }
    });
  }

  loadCauseDetails(slug: string) {
    this.causesService.getWebsiteCauseDetails(slug).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data) {
          const item = res.data;
          
          let causeImages = [];
          if (item.images && item.images.length > 0) {
            causeImages = item.images.map((img: any) => typeof img === 'string' ? img : img.url);
          } else {
             // fallback image if no gallery
            causeImages = [item.cover_image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'];
          }
          
          const rawDesc = item.description || item.short_description || '';
          const cleanDesc = rawDesc.replace(/&nbsp;/g, ' ');
          
          this.causeDetail = {
            name: item.name,
            description: cleanDesc,
            shortDescription: item.short_description,
            coverImage: item.cover_image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
            goal_amount: item.goal_amount || 500000,
            raised_amount: item.raised_amount || 0,
            donors_count: 245, // Static as requested
            is_active: item.is_active,
            is_featured: item.is_featured,
            starts_at: item.starts_at,
            ends_at: item.ends_at,
            images: causeImages
          };
          
          this.ngo = {
            id: item.id,
            name: item.name,
            slug: item.slug,
            coverImage: item.cover_image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
            logo: 'https://images.unsplash.com/photo-1531206715517-5c0bf140bd33?q=80',
            causes: Array.isArray(item.tags) ? item.tags : (item.tags_string ? item.tags_string.split(',').map((t:string)=>t.trim()) : []),
            shortDescription: item.short_description,
            longDescription: item.description,
            causeDetail: this.causeDetail
          };
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load cause details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
