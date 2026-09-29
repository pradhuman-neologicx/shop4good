import { NgOptimizedImage } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Marketplace {
  name: string;
  src: string;
  url?: string;
  description?: string;
}

@Component({
  selector: 'app-marketplace-modal',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './marketplace-modal.component.html',
  styleUrl: './marketplace-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketplaceModalComponent {
  @Input() isOpen = false;
  @Input() marketplaces: Marketplace[] = [];
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }
}
