import {
  Component,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export interface CountryCode {
  code: string;
  dial: string;
  name: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
  ],
})
export class ContactComponent {
  private googleSheetUrl =
    'https://script.google.com/macros/s/AKfycbxhx5hHVtVocMgxabwGet6KFo0HLiD-HKTq0wX-uNj6Lk5Xc8VwENvyJr4XEvr3E3H7oQ/exec';

  // Exactly 4 fields matching the Figma form
  formData = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  selectedCountry: CountryCode = {
    code: 'IN',
    dial: '+91',
    name: 'India',
  };

  countryList: CountryCode[] = [
    { code: 'IN', dial: '+91', name: 'India' },
    { code: 'GB', dial: '+44', name: 'United Kingdom' },
    { code: 'US', dial: '+1', name: 'United States' },
    { code: 'AE', dial: '+971', name: 'UAE' },
    { code: 'CA', dial: '+1', name: 'Canada' },
    { code: 'AU', dial: '+61', name: 'Australia' },
  ];

  isCountryDropdownOpen = false;
  submitted = false;
  isSubmitting = false;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-dropdown-wrap')) {
      this.isCountryDropdownOpen = false;
    }
  }

  constructor(
    private notificationService: NotificationService,
  ) {}

  toggleCountryDropdown(): void {
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.isCountryDropdownOpen = false;
  }

  onSubmit(): void {
    // 1. Mandatory Fields Validation (name, email, message)
    if (!this.formData.name.trim() || !this.formData.email.trim() || !this.formData.message.trim()) {
      this.notificationService.show(
        'Please fill in your name, email, and message.',
        'error',
      );
      return;
    }

    // 2. Email Validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.formData.email.trim())) {
      this.notificationService.show(
        'Please enter a valid email address.',
        'error',
      );
      return;
    }

    // 3. Phone Validation (Numbers only - if provided)
    if (this.formData.phone.trim()) {
      const cleanPhone = this.formData.phone.replace(/[\s-]/g, '');
      const phonePattern = /^\d{7,15}$/;
      if (!phonePattern.test(cleanPhone)) {
        this.notificationService.show(
          'Please enter a valid phone number (digits only).',
          'error',
        );
        return;
      }
    }

    this.isSubmitting = true;

    const fullPhoneNumber = this.formData.phone.trim()
      ? `${this.selectedCountry.dial} ${this.formData.phone.trim()}`
      : '';

    const payload = {
      name: this.formData.name.trim(),
      email: this.formData.email.trim(),
      phone: fullPhoneNumber,
      message: this.formData.message.trim(),
      formType: 'contact',
    };

    fetch(this.googleSheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        this.submitted = true;
        this.isSubmitting = false;
        this.notificationService.show(
          'Message sent successfully! We will get back to you soon.',
          'success',
        );
      })
      .catch((error) => {
        console.error('Submission error:', error);
        this.isSubmitting = false;
        this.notificationService.show(
          'Something went wrong. Please try again.',
          'error',
        );
      });
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: '',
    };
    this.submitted = false;
    this.isSubmitting = false;
  }
}
