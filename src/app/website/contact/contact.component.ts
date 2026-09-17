import {
  Component,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
// import { HeaderSectionComponent } from '../components/header-section/header-section.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../components/footer/footer.component';
import { NgOptimizedImage } from '@angular/common';

declare const grecaptcha: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NavbarComponent,
    // HeaderSectionComponent,
    FormsModule,
    FooterComponent,
    NgOptimizedImage,
  ],
})
export class ContactComponent {
  private googleSheetUrl =
    'https://script.google.com/macros/s/AKfycbxhx5hHVtVocMgxabwGet6KFo0HLiD-HKTq0wX-uNj6Lk5Xc8VwENvyJr4XEvr3E3H7oQ/exec';

  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  subjectOptions = [
    'Account Support',
    'Donation Inquiry',
    'Marketplace Issue',
    'Partnership',
    'Feedback',
    'Other',
  ];

  submitted = false;
  isSubmitting = false;

  isSubjectDropdownOpen = false;
  isHospitalDropdownOpen = false;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select-wrap')) {
      this.isSubjectDropdownOpen = false;
    }
  }

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private eRef: ElementRef,
  ) {}

  toggleSubjectDropdown() {
    this.isSubjectDropdownOpen = !this.isSubjectDropdownOpen;
  }

  selectSubject(subject: string) {
    this.formData.subject = subject;
    this.isSubjectDropdownOpen = false;
  }

  onSubmit() {
    // 1. Check for Mandatory Fields
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      this.notificationService.show(
        'Please fill in all mandatory fields marked with *',
        'error',
      );
      return;
    }

    // 2. Email Validation (Pattern)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.formData.email)) {
      this.notificationService.show(
        'Please enter a valid email address.',
        'error',
      );
      return;
    }

    // 3. Phone Validation (10 digits, numbers only - if provided)
    if (this.formData.phone) {
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(this.formData.phone)) {
        this.notificationService.show(
          'Phone number must be exactly 10 digits (numbers only).',
          'error',
        );
        return;
      }
    }

    this.isSubmitting = true;

    grecaptcha.ready(() => {
      grecaptcha
        .execute('6LdHvfMsAAAAAId4VWi0zD7O5RlN9GV7O7GMHAhf', {
          action: 'contact_submit',
        })
        .then((token: string) => {
          // Adding formType and recaptchaToken to identify and verify this as a contact message
          const payload = {
            ...this.formData,
            recaptchaToken: token,
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
            })
            .catch((error) => {
              console.error('Submission error:', error);
              this.submitted = true;
              this.isSubmitting = false;
            });
        })
        .catch((error: any) => {
          console.error('reCAPTCHA execution error:', error);
          this.notificationService.show(
            'Security verification failed. Please try again.',
            'error',
          );
          this.isSubmitting = false;
        });
    });
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    };
    this.submitted = false;
    this.isSubmitting = false;
  }
}
