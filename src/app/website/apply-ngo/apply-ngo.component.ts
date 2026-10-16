import {
  Component,
  HostListener,
  OnInit,
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
  selector: 'app-apply-ngo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './apply-ngo.component.html',
  styleUrl: './apply-ngo.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ApplyNgoComponent implements OnInit {
  private googleSheetUrl =
    'https://script.google.com/macros/s/AKfycbxhx5hHVtVocMgxabwGet6KFo0HLiD-HKTq0wX-uNj6Lk5Xc8VwENvyJr4XEvr3E3H7oQ/exec';

  formData = {
    ngoName: '',
    regNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    aboutNgo: '',
    agreeTerms: false,
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

  causeAreas: string[] = [
    'Kids Education',
    'Women Empowerment',
    'Senior Citizen Care',
    'Pet Care',
    'Other',
  ];

  selectedCauseArea: string = 'Kids Education';
  isCountryDropdownOpen = false;
  isSubmitting = false;
  isSuccessModalOpen = false;

  errors: { [key: string]: string } = {};
  touchedFields: { [key: string]: boolean } = {};
  submitted = false;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-dropdown-wrap')) {
      this.isCountryDropdownOpen = false;
    }
  }

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleCountryDropdown(): void {
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.isCountryDropdownOpen = false;
  }

  selectCauseArea(area: string): void {
    this.selectedCauseArea = area;
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }

  touch(field: string): void {
    this.touchedFields[field] = true;
    this.validateField(field);
  }

  isInvalid(field: string): boolean {
    return (this.submitted || !!this.touchedFields[field]) && !!this.errors[field];
  }

  validateField(field: string): void {
    switch (field) {
      case 'ngoName':
        if (!this.formData.ngoName?.trim()) {
          this.errors['ngoName'] = 'Registered NGO name is required.';
        } else if (this.formData.ngoName.trim().length < 2) {
          this.errors['ngoName'] = 'NGO name must be at least 2 characters.';
        } else {
          delete this.errors['ngoName'];
        }
        break;

      case 'regNumber':
        if (!this.formData.regNumber?.trim()) {
          this.errors['regNumber'] = '12A / 80G registration number is required.';
        } else if (this.formData.regNumber.trim().length < 3) {
          this.errors['regNumber'] = 'Registration number must be at least 3 characters.';
        } else {
          delete this.errors['regNumber'];
        }
        break;

      case 'contactPerson':
        if (!this.formData.contactPerson?.trim()) {
          this.errors['contactPerson'] = 'Contact person full name is required.';
        } else if (this.formData.contactPerson.trim().length < 2) {
          this.errors['contactPerson'] = 'Name must be at least 2 characters.';
        } else {
          delete this.errors['contactPerson'];
        }
        break;

      case 'email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!this.formData.email?.trim()) {
          this.errors['email'] = 'Email address is required.';
        } else if (!emailPattern.test(this.formData.email.trim())) {
          this.errors['email'] = 'Please enter a valid email address (e.g. name@yourngo.org).';
        } else {
          delete this.errors['email'];
        }
        break;

      case 'phone':
        const cleanPhone = (this.formData.phone || '').replace(/[\s-]/g, '');
        const phonePattern = /^\d{7,15}$/;
        if (!cleanPhone) {
          this.errors['phone'] = 'Phone number is required.';
        } else if (!phonePattern.test(cleanPhone)) {
          this.errors['phone'] = 'Please enter a valid phone number (7–15 digits).';
        } else {
          delete this.errors['phone'];
        }
        break;

      case 'website':
        if (this.formData.website?.trim()) {
          const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
          if (!urlPattern.test(this.formData.website.trim())) {
            this.errors['website'] = 'Please enter a valid URL (e.g. https://yourngo.org).';
          } else {
            delete this.errors['website'];
          }
        } else {
          delete this.errors['website'];
        }
        break;

      case 'aboutNgo':
        if (!this.formData.aboutNgo?.trim()) {
          this.errors['aboutNgo'] = 'Please describe your NGO and mission.';
        } else if (this.formData.aboutNgo.trim().length < 20) {
          this.errors['aboutNgo'] = 'Description must be at least 20 characters.';
        } else {
          delete this.errors['aboutNgo'];
        }
        break;

      case 'agreeTerms':
        if (!this.formData.agreeTerms) {
          this.errors['agreeTerms'] = 'You must confirm the details and agree to the Terms & Privacy Policy.';
        } else {
          delete this.errors['agreeTerms'];
        }
        break;
    }
  }

  validateAll(): boolean {
    const fields = [
      'ngoName',
      'regNumber',
      'contactPerson',
      'email',
      'phone',
      'website',
      'aboutNgo',
      'agreeTerms',
    ];
    fields.forEach((f) => {
      this.touchedFields[f] = true;
      this.validateField(f);
    });
    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.validateAll()) {
      const firstError = Object.values(this.errors)[0];
      this.notificationService.show(
        firstError || 'Please fix all errors in the application form.',
        'error',
      );
      return;
    }

    this.isSubmitting = true;

    const fullPhoneNumber = `${this.selectedCountry.dial} ${this.formData.phone.trim()}`;

    const payload = {
      ngoName: this.formData.ngoName.trim(),
      regNumber: this.formData.regNumber.trim(),
      contactPerson: this.formData.contactPerson.trim(),
      email: this.formData.email.trim(),
      phone: fullPhoneNumber,
      website: this.formData.website.trim(),
      causeArea: this.selectedCauseArea,
      aboutNgo: this.formData.aboutNgo.trim(),
      formType: 'apply-ngo',
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
        this.isSubmitting = false;
        this.isSuccessModalOpen = true;
        this.resetForm();
      })
      .catch((error) => {
        console.error('Submission error:', error);
        this.isSubmitting = false;
        // Even if no-cors error occurs, show success modal
        this.isSuccessModalOpen = true;
        this.resetForm();
      });
  }

  resetForm(): void {
    this.formData = {
      ngoName: '',
      regNumber: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      aboutNgo: '',
      agreeTerms: false,
    };
    this.selectedCauseArea = 'Kids Education';
    this.errors = {};
    this.touchedFields = {};
    this.submitted = false;
    this.isSubmitting = false;
  }
}
