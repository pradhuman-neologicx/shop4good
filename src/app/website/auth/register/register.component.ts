import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicApiService } from 'src/app/core/services/public-api.service';
import { LoginService } from 'src/app/core/services/login.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  step = 1;

  isEmailVerified = false;
  isPhoneVerified = false;
  verificationToken = '';
  otpForm!: FormGroup;

  isSendingEmailOtp = false;
  isSendingPhoneOtp = false;
  emailOtpSent = false;
  phoneOtpSent = false;
  
  private destroyRef = inject(DestroyRef);
  
  isSendingOtp = false;
  isVerifyingOtp = false;

  constructor(
    private fb: FormBuilder, 
    private publicApiService: PublicApiService, 
    private loginService: LoginService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
    private jwtService: JwtService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });

    this.otpForm = this.fb.group({
      emailOtp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      phoneOtp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
  }

  get f() { return this.registerForm.controls; }

  goToNextStep() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.isSendingOtp = true;
    
    // TODO: Call your check-user API here when you have it.
    // For now, simulating API call success to unblock the UI.
    setTimeout(() => {
      this.isSendingOtp = false;
      this.step = 2; // Move to verification step
      this.cdr.detectChanges();
    }, 300);
  }

  backToStep1() {
    this.step = 1;
  }

  sendEmailOtp() {
    this.isSendingEmailOtp = true;
    
    // Mocking API call for UI testing
    setTimeout(() => {
      this.isSendingEmailOtp = false;
      this.emailOtpSent = true;
      this.notification.show('OTP sent to email', 'success');
      this.cdr.detectChanges();
    }, 1000);
  }

  sendPhoneOtp() {
    this.isSendingPhoneOtp = true;
    
    // Mocking API call for UI testing
    setTimeout(() => {
      this.isSendingPhoneOtp = false;
      this.phoneOtpSent = true;
      this.notification.show('OTP sent to phone', 'success');
      this.cdr.detectChanges();
    }, 1000);
  }

  verifyBothOtps() {
    // Basic frontend validation for OTP form
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isVerifyingOtp = true;
    
    // Mocking OTP verification for UI testing
    setTimeout(() => {
      this.isVerifyingOtp = false;
      this.isEmailVerified = true;
      this.isPhoneVerified = true;
      this.notification.show('Verification successful!', 'success');
      this.cdr.detectChanges();
      
      this.onSubmitRegistration();
    }, 1500);
  }

  isSubmitting = false;

  onSubmitRegistration() {
    this.isSubmitting = true;

    // Mocking final registration API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.notification.show('Registration successful! (Mocked)', 'success');
      this.router.navigate(['/']);
      this.cdr.detectChanges();
    }, 1500);
  }
}
