import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Cause {
  id: string;
  title: string;
  subtitle?: string;
  foundation: string;
  image: string;
  bgColor: string;
}

@Component({
  selector: 'app-choose-cause',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './choose-cause.component.html',
  styleUrl: './choose-cause.component.scss'
})
export class ChooseCauseComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() currentCauseId: string | null | undefined = null;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() causeSelected = new EventEmitter<Cause>();
  @Output() close = new EventEmitter<void>();

  causes: Cause[] = [
    {
      id: 'kids',
      title: 'Kids Education',
      subtitle: 'Brighter minds for a brighter tomorrow',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#1e3a8a'
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      subtitle: 'Stronger Women Build Stronger Communities',
      foundation: 'PraveenLata Sansthan Foundation',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#d2386c'
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      subtitle: 'Respect, care and a more dignified tomorrow.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#4a8dd6'
    },
    {
      id: 'pets',
      title: 'Pet Care',
      subtitle: 'Better care for happier companions.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#245e55'
    }
  ];

  selectedId: string = 'kids';

  ngOnInit(): void {
    this.syncSelectedId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true || changes['currentCauseId']) {
      this.syncSelectedId();
    }
  }

  private syncSelectedId(): void {
    if (this.currentCauseId) {
      this.selectedId = this.currentCauseId;
      return;
    }

    try {
      const saved = localStorage.getItem('shop4good_supported_cause');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id) {
          this.selectedId = parsed.id;
          return;
        }
      }
    } catch {
      // Fallback
    }

    this.selectedId = 'kids';
  }

  selectTempCause(id: string): void {
    this.selectedId = id;
  }

  saveSelection(): void {
    const chosen = this.causes.find((c) => c.id === this.selectedId) || this.causes[0];
    localStorage.setItem('shop4good_supported_cause', JSON.stringify(chosen));
    this.causeSelected.emit(chosen);
    this.onClose();
  }

  onClose(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.close.emit();
  }
}
