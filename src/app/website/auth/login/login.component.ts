import { NgOptimizedImage, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicApiService } from 'src/app/core/services/public-api.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ReactiveFormsModule, NgClass],
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  otpForm: FormGroup;
  
  activeTab: 'phone' | 'email' = 'phone';
  submitted = false;
  showOtpModal = false;
  isSendingOtp = false;
  isVerifyingOtp = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private jwtService: JwtService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['']
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.switchTab('phone');
  }

  get f() { return this.loginForm.controls; }

  switchTab(tab: 'phone' | 'email') {
    this.activeTab = tab;
    this.submitted = false;
    
    if (tab === 'phone') {
      this.loginForm.get('mobile')?.setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
      this.loginForm.get('email')?.clearValidators();
    } else {
      this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('mobile')?.clearValidators();
    }
    this.loginForm.get('mobile')?.updateValueAndValidity();
    this.loginForm.get('email')?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isSendingOtp = true;
    
    // Static API mock for sending OTP
    setTimeout(() => {
      this.isSendingOtp = false;
      this.otpForm.reset();
      this.showOtpModal = true;
      this.notification.show('OTP sent successfully (Mock)', 'success');
      this.cdr.detectChanges();
    }, 800);
  }

  closeOtpModal() {
    this.showOtpModal = false;
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.isVerifyingOtp = true;
    
    // Static API mock for verifying OTP
    setTimeout(() => {
      this.isVerifyingOtp = false;
      
      const staticUser = { 
        id: 1, 
        name: 'Mock User', 
        email: this.activeTab === 'email' ? this.loginForm.value.email : 'user@example.com', 
        mobile: this.activeTab === 'phone' ? this.loginForm.value.mobile : '9999999999' 
      };
      const staticToken = 'static_mock_token_12345';
      
      this.jwtService.setCustomerIsLoggedIn(true);
      this.jwtService.saveCustomerToken(staticToken);
      this.jwtService.saveCustomerData(staticUser);
      this.jwtService.saveCustomerId(staticUser.id);
      
      this.showOtpModal = false;
      this.notification.show('Logged in successfully!', 'success');
      this.router.navigate(['/profile']);
      this.cdr.detectChanges();
    }, 800);
  }
}
