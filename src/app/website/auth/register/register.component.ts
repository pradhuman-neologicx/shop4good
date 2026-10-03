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

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  
  if (control.get('confirmPassword')?.hasError('passwordMismatch')) {
    control.get('confirmPassword')?.setErrors(null);
  }
  
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  passwordFocused = false;
  submitted = false;

  isEmailVerified = false;
  verificationToken = '';
  showOtpModal = false;
  otpForm!: FormGroup;

  // Custom Mock Data
  allCountries = [
    { code: '+91', name: 'India', iso: 'IN' },
    { code: '+1', name: 'USA', iso: 'US' },
    { code: '+44', name: 'UK', iso: 'GB' },
    { code: '+61', name: 'Australia', iso: 'AU' }
  ];

  allStates: any[] = [];
  countries = this.allCountries;
  states: any[] = [];
  cities: any[] = [];
  
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
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      countryCode: ['+91', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: passwordMatchValidator });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.loadStates();

    this.registerForm.get('countryCode')?.valueChanges.subscribe(countryCode => {
      this.registerForm.get('state')?.setValue('');
      this.registerForm.get('city')?.setValue('');
      
      this.filterStatesByCountry(countryCode);
      this.cities = [];
    });

    this.registerForm.get('state')?.valueChanges.subscribe(stateId => {
      this.registerForm.get('city')?.setValue('');
      
      if (stateId) {
        this.loadCities(Number(stateId));
      } else {
        this.cities = [];
      }
    });
  }

  loadStates() {
    this.publicApiService.getStates().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.allStates = res.data || [];
        const initialCountryCode = this.registerForm.get('countryCode')?.value;
        this.filterStatesByCountry(initialCountryCode);
      },
      error: (err) => console.error(err)
    });
  }

  filterStatesByCountry(countryCode: string) {
    const country = this.allCountries.find(c => c.code === countryCode);
    if (country) {
      this.states = this.allStates.filter(s => s.country_code === country.iso);
    } else {
      this.states = [];
    }
  }

  loadCities(stateId: number) {
    this.publicApiService.getCitiesByState(stateId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.cities = res.data || [];
      },
      error: (err) => console.error(err)
    });
  }

  get f() { return this.registerForm.controls; }

  get passwordReqs() {
    const p = this.f['password'].value || '';
    return {
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /\d/.test(p),
      special: /[@$!%*?&]/.test(p)
    };
  }

  togglePassword(type: 'password' | 'confirm') {
    if (type === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  openOtpModal() {
    if (this.f['email'].valid) {
      this.isSendingOtp = true;
      const payload = {
        email: this.f['email'].value,
        purpose: 'register'
      };

      this.loginService.AdminForgetPasswordApi(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.isSendingOtp = false;
          if (res && (res.status === 200 || res.status === 'success' || res.status === true || res.code === 200)) {
            this.otpForm.reset();
            this.showOtpModal = true;
            this.notification.show('OTP sent successfully', 'success');
          } else {
            this.notification.show(res.message || 'Failed to send OTP', 'error');
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSendingOtp = false;
          console.error(err);
          // this.notification.show('Error sending OTP. Please try again later.', 'error');
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeOtpModal() {
    this.showOtpModal = false;
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.isVerifyingOtp = true;
    const payload = {
      email: this.f['email'].value,
      otp: this.otpForm.get('otp')?.value,
      purpose: 'register'
    };

    this.loginService.AdminVerifyOtpApi(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isVerifyingOtp = false;
        if (res && (res.status === 200 || res.status === 'success' || res.status === true || res.code === 200)) {
          this.isEmailVerified = true;
          this.verificationToken = res.data?.verification_token || res.verification_token || res.data?.token || '';
          this.closeOtpModal();
          this.notification.show('Email verified successfully!', 'success');
        } else {
          this.otpForm.get('otp')?.setErrors({ invalid: true });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isVerifyingOtp = false;
        console.error(err);
        this.otpForm.get('otp')?.setErrors({ invalid: true });
        this.cdr.detectChanges();
      }
    });
  }

  isSubmitting = false;

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    if (!this.isEmailVerified) {
      this.notification.show('Please verify your email address before registering.', 'error');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      verification_token: this.verificationToken,
      mobile: this.f['phone'].value,
      password: this.f['password'].value,
      password_confirmation: this.f['confirmPassword'].value,
      gender: this.f['gender'].value,
      state_id: this.f['state'].value,
      city_id: this.f['city'].value
    };

    this.publicApiService.register(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res && (res.status === 201 || res.status === 200 || res.status === 'success' || res.status === true || res.code === 200 || res.code === 201)) {
          // Save customer data in local storage
          const token = res.data?.token || res.token;
          const user = res.data?.user || res.user || res.data;
          
          if (token && user) {
            this.jwtService.setCustomerIsLoggedIn(true);
            this.jwtService.saveCustomerToken(token);
            this.jwtService.saveCustomerId(user.id);
            this.jwtService.saveCustomerData(user);
          }
          
          this.notification.show('Registration successful!', 'success');
          
          // Redirect to profile or home page
          this.router.navigate(['/']);
        } else {
          this.notification.show(res.message || 'Registration failed', 'error');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        // this.notification.show('An error occurred during registration.', 'error');
        this.cdr.detectChanges();
      }
    });
  }
}
