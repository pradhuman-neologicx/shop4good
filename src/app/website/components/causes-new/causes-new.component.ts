import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { ChooseCauseComponent, Cause as BaseCause } from '../../choose-cause/choose-cause.component';

export interface Cause extends BaseCause {
  description?: string;
}

@Component({
  selector: 'app-causes-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ChooseCauseComponent],
  templateUrl: './causes-new.component.html',
  styleUrl: './causes-new.component.scss'
})
export class CausesNewComponent implements OnInit {
  causes: Cause[] = [
    {
      id: 'kids',
      title: 'Kids Education',
      subtitle: 'Every child deserves a classroom',
      description: 'Support NGOs building schools, providing scholarships, and training teachers in underserved communities.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#1e3a8a' 
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      subtitle: 'Strength in every woman',
      description: 'Back programmes that provide skills training, legal aid, and economic independence to women.',
      foundation: 'PraveenLata Sansthan Foundation',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#d2386c'
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      subtitle: 'Compassion and support for the elderly',
      description: 'Help us give the elderly the comfort of aging with dedicated help they can trust.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#4a8dd6' 
    },
    {
      id: 'pets',
      title: 'Animal Welfare',
      subtitle: 'Compassion for every creature',
      description: 'Support rescue shelters, spay-neuter drives, and wildlife conservation efforts.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#245e55'
    }
  ];

  isLoggedIn: boolean = false;
  supportedCause: Cause | null = null;
  isChooseSheetOpen: boolean = false;
  selectedCauseId: string | null = null;

  constructor(
    private jwtService: JwtService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkAuthAndCause();
  }

  checkAuthAndCause(): void {
    this.isLoggedIn = this.jwtService.getCustomerIsLoggedIn();

    if (this.isLoggedIn) {
      const saved = localStorage.getItem('shop4good_supported_cause');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const match = this.causes.find(
            (c) => c.id === parsed.id || c.title.toLowerCase() === parsed.title?.toLowerCase()
          );
          this.supportedCause = match || parsed;
        } catch {
          this.supportedCause = null;
        }
      } else {
        const customer = this.jwtService.getCustomerData();
        if (customer && customer.supported_cause) {
          const match = this.causes.find((c) => c.id === customer.supported_cause.id);
          this.supportedCause = match || customer.supported_cause;
        } else {
          this.supportedCause = null;
        }
      }
    } else {
      this.supportedCause = null;
    }
    this.cdr.markForCheck();
  }

  openChooseSheet(): void {
    this.isChooseSheetOpen = true;
    this.cdr.markForCheck();
  }

  closeChooseSheet(): void {
    this.isChooseSheetOpen = false;
    this.cdr.markForCheck();
  }

  onCauseSaved(cause: Cause): void {
    this.supportedCause = cause;
    localStorage.setItem('shop4good_supported_cause', JSON.stringify(cause));
    this.isChooseSheetOpen = false;
    this.cdr.markForCheck();
  }

  selectCause(id: string): void {
    this.selectedCauseId = id;
  }
}
