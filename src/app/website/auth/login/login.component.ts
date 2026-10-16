import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,  ReactiveFormsModule, FormsModule, CommonModule],
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  
  // Step state: 'input' -> 'otp' -> 'success'
  step: 'input' | 'otp' | 'success' = 'input';
  activeTab: 'phone' | 'email' = 'phone';
  
  // 6 separate OTP digits
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpError: string = '';
  
  // Resend Timer
  resendCountdown = 30;
  canResend = false;
  private timerInterval: any = null;

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
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.switchTab('phone');
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  get f() { 
    return this.loginForm.controls; 
  }

  switchTab(tab: 'phone' | 'email') {
    this.activeTab = tab;
    this.loginForm.markAsUntouched();
    
    if (tab === 'phone') {
      this.loginForm.get('phone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
      this.loginForm.get('email')?.clearValidators();
    } else {
      this.loginForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('phone')?.clearValidators();
    }
    this.loginForm.get('phone')?.updateValueAndValidity();
    this.loginForm.get('email')?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 10);
    this.loginForm.get('phone')?.setValue(clean, { emitEvent: false });
    input.value = clean;
  }

  onSubmitInput() {
    const control = this.activeTab === 'phone' ? this.loginForm.get('phone') : this.loginForm.get('email');
    if (!control || control.invalid) {
      control?.markAsTouched();
      const msg = this.activeTab === 'phone' 
        ? 'Please enter a valid 10-digit phone number' 
        : 'Please enter a valid email address';
      this.notification.show(msg, 'error');
      return;
    }

    this.isSendingOtp = true;
    setTimeout(() => {
      this.isSendingOtp = false;
      this.step = 'otp';
      this.otpDigits = ['', '', '', '', '', ''];
      this.otpError = '';
      this.startCountdown();
      
      const destination = this.activeTab === 'phone' 
        ? '+91 ' + this.loginForm.value.phone 
        : this.loginForm.value.email;
      this.notification.show(`Verification code sent to ${destination} (Use code: 123456)`, 'info');
      this.cdr.detectChanges();

      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        firstInput?.focus();
      }, 100);
    }, 400);
  }

  startCountdown() {
    this.clearTimer();
    this.resendCountdown = 30;
    this.canResend = false;
    this.timerInterval = setInterval(() => {
      if (this.resendCountdown > 1) {
        this.resendCountdown--;
        this.cdr.detectChanges();
      } else {
        this.resendCountdown = 0;
        this.canResend = true;
        this.clearTimer();
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resendOtp() {
    if (!this.canResend) return;
    this.startCountdown();
    this.notification.show('New code sent! (Use code: 123456)', 'info');
  }

  onOtpDigitInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    if (value.length > 1) {
      this.handlePastedOtp(value);
      return;
    }

    this.otpDigits[index] = value;
    this.otpError = '';

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
    this.cdr.detectChanges();
  }

  onOtpKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      if (!this.otpDigits[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
        this.otpDigits[index - 1] = '';
        this.cdr.detectChanges();
      } else {
        this.otpDigits[index] = '';
      }
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const clean = pasted.replace(/\D/g, '').slice(0, 6);
    this.handlePastedOtp(clean);
  }

  private handlePastedOtp(clean: string) {
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = clean[i] || '';
    }
    const targetIdx = Math.min(clean.length, 5);
    const targetInput = document.getElementById(`otp-${targetIdx}`) as HTMLInputElement;
    targetInput?.focus();
    this.otpError = '';
    this.cdr.detectChanges();
  }

  verifyOtp() {
    const fullCode = this.otpDigits.join('');
    if (fullCode.length < 6) {
      this.otpError = 'Please enter all 6 digits of the verification code';
      return;
    }

    if (fullCode !== '123456' && fullCode.length !== 6) {
      this.otpError = 'Invalid code. For testing, use code: 123456';
      return;
    }

    this.isVerifyingOtp = true;
    setTimeout(() => {
      this.isVerifyingOtp = false;
      this.clearTimer();

      const user = {
        id: 1,
        name: 'Umeed Singh',
        email: this.activeTab === 'email' ? this.loginForm.value.email : 'ummeds@gmail.com',
        mobile: this.activeTab === 'phone' ? this.loginForm.value.phone : '98XXXXXX32',
        avatar_url: 'assets/images/umeed_singh.jpg'
      };

      this.jwtService.setCustomerIsLoggedIn(true);
      this.jwtService.saveCustomerToken('mock_login_token_12345');
      this.jwtService.saveCustomerData(user);
      this.jwtService.saveCustomerId(user.id);

      this.step = 'success';
      this.notification.show('Welcome back! Logged in successfully.', 'success');
      this.cdr.detectChanges();
    }, 400);
  }

  onSocialLogin(provider: string) {
    this.notification.show(`Logging in with ${provider} (Mock)...`, 'info');
    setTimeout(() => {
      const user = {
        id: 1,
        name: 'Umeed Singh',
        email: `umeed.${provider.toLowerCase()}@gmail.com`,
        mobile: '98XXXXXX32',
        avatar_url: 'assets/images/umeed_singh.jpg'
      };
      this.jwtService.setCustomerIsLoggedIn(true);
      this.jwtService.saveCustomerToken(`mock_${provider.toLowerCase()}_token`);
      this.jwtService.saveCustomerData(user);
      this.jwtService.saveCustomerId(user.id);
      this.step = 'success';
      this.notification.show('Logged in successfully!', 'success');
      this.cdr.detectChanges();
    }, 500);
  }

  onStartShopping() {
    this.router.navigate(['/shop']);
  }

  onClose() {
    if (this.step === 'otp') {
      this.step = 'input';
      this.clearTimer();
    } else {
      this.router.navigate(['/']);
    }
  }
}
