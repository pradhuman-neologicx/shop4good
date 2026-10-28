import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,  ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;

  // Step state: 'input' -> 'otp' -> 'name' -> 'success'
  step: 'input' | 'otp' | 'name' | 'success' = 'input';
  activeTab: 'phone' | 'email' = 'phone';

  // Causes options for "Choose the cause you want to support"
  causes = [
    {
      id: 'kids',
      title: 'Kids Education',
      subtitle: 'Education & schooling',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#1e3a8a'
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      subtitle: 'Skills & independence',
      foundation: 'PraveenLata Sansthan Foundation',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#d2386c'
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      subtitle: 'Elderly care & comfort',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#4a8dd6'
    },
    {
      id: 'pets',
      title: 'Animal Welfare',
      subtitle: 'Rescue & animal health',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#245e55'
    }
  ];

  selectedCauseId: string = 'kids';

  // 6 separate OTP digits
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpError: string = '';

  // Resend Timer
  resendCountdown = 30;
  canResend = false;
  private timerInterval: any = null;

  isSendingOtp = false;
  isVerifyingOtp = false;
  isSubmittingName = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      causeId: ['kids', [Validators.required]]
    });
  }

  ngOnInit() {
    this.switchTab('phone');
    this.initSelectedCause();
  }

  initSelectedCause() {
    try {
      const saved = localStorage.getItem('shop4good_supported_cause');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id && this.causes.some((c) => c.id === parsed.id)) {
          this.selectedCauseId = parsed.id;
          this.registerForm.get('causeId')?.setValue(parsed.id);
          return;
        }
      }
    } catch {
      // Fallback
    }
    this.selectedCauseId = 'kids';
    this.registerForm.get('causeId')?.setValue('kids');
  }

  selectCause(causeId: string) {
    this.selectedCauseId = causeId;
    this.registerForm.get('causeId')?.setValue(causeId);
    this.cdr.detectChanges();
  }

  getSelectedCause() {
    return this.causes.find((c) => c.id === this.selectedCauseId) || this.causes[0];
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  get f() {
    return this.registerForm.controls;
  }

  switchTab(tab: 'phone' | 'email') {
    this.activeTab = tab;
    this.registerForm.get('phone')?.markAsUntouched();
    this.registerForm.get('email')?.markAsUntouched();

    if (tab === 'phone') {
      this.registerForm.get('phone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
      this.registerForm.get('email')?.clearValidators();
    } else {
      this.registerForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.registerForm.get('phone')?.clearValidators();
    }
    this.registerForm.get('phone')?.updateValueAndValidity();
    this.registerForm.get('email')?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const clean = input.value.replace(/\D/g, '').slice(0, 10);
    this.registerForm.get('phone')?.setValue(clean, { emitEvent: false });
    input.value = clean;
  }

  // STEP 1: Submit Phone or Email
  onSubmitInput() {
    const control = this.activeTab === 'phone' ? this.registerForm.get('phone') : this.registerForm.get('email');
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
        ? '+91 ' + this.registerForm.value.phone 
        : this.registerForm.value.email;
      this.notification.show(`Verification code sent to ${destination} (Use code: 123456)`, 'info');
      this.cdr.detectChanges();

      setTimeout(() => {
        const firstInput = document.getElementById('reg-otp-0');
        firstInput?.focus();
      }, 100);
    }, 400);
  }

  // Timer controls
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

  onChangeContact() {
    this.clearTimer();
    this.step = 'input';
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError = '';
    this.cdr.detectChanges();
  }

  // OTP Handlers
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
      const nextInput = document.getElementById(`reg-otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
    this.cdr.detectChanges();
  }

  onOtpKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      if (!this.otpDigits[index] && index > 0) {
        const prevInput = document.getElementById(`reg-otp-${index - 1}`) as HTMLInputElement;
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
    const targetInput = document.getElementById(`reg-otp-${targetIdx}`) as HTMLInputElement;
    targetInput?.focus();
    this.otpError = '';
    this.cdr.detectChanges();
  }

  // STEP 2: Verify OTP
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
      this.step = 'name';
      this.notification.show('Code verified! Tell us your name.', 'success');
      this.cdr.detectChanges();

      setTimeout(() => {
        const nameInput = document.getElementById('reg-name-input');
        nameInput?.focus();
      }, 100);
    }, 400);
  }

  // STEP 3: Submit Name
  onSubmitName() {
    const nameControl = this.registerForm.get('name');
    if (!nameControl || nameControl.invalid) {
      nameControl?.markAsTouched();
      this.notification.show('Please enter your full name (at least 2 characters)', 'error');
      return;
    }

    this.isSubmittingName = true;
    setTimeout(() => {
      this.isSubmittingName = false;

      const chosenCause = this.getSelectedCause();
      try {
        localStorage.setItem('shop4good_supported_cause', JSON.stringify(chosenCause));
      } catch (e) {
        console.error(e);
      }

      const newUser = {
        id: Date.now(),
        name: nameControl.value.trim(),
        email: this.activeTab === 'email' ? this.registerForm.value.email : 'user@example.com',
        mobile: this.activeTab === 'phone' ? this.registerForm.value.phone : '98XXXXXX32',
        avatar_url: 'assets/images/umeed_singh.jpg',
        supported_cause: chosenCause
      };

      this.jwtService.setCustomerIsLoggedIn(true);
      this.jwtService.saveCustomerToken(`mock_register_token_${Date.now()}`);
      this.jwtService.saveCustomerData(newUser);
      this.jwtService.saveCustomerId(newUser.id);

      this.step = 'success';
      this.notification.show('Account created successfully!', 'success');
      this.cdr.detectChanges();
    }, 400);
  }

  onSocialRegister(provider: string) {
    this.notification.show(`Signing up with ${provider} (Mock)...`, 'info');
    setTimeout(() => {
      const chosenCause = this.getSelectedCause();
      try {
        localStorage.setItem('shop4good_supported_cause', JSON.stringify(chosenCause));
      } catch (e) {
        console.error(e);
      }

      const user = {
        id: Date.now(),
        name: `${provider} User`,
        email: `newuser.${provider.toLowerCase()}@gmail.com`,
        mobile: '98XXXXXX32',
        avatar_url: 'assets/images/umeed_singh.jpg',
        supported_cause: chosenCause
      };
      this.jwtService.setCustomerIsLoggedIn(true);
      this.jwtService.saveCustomerToken(`mock_${provider.toLowerCase()}_token`);
      this.jwtService.saveCustomerData(user);
      this.jwtService.saveCustomerId(user.id);
      this.step = 'success';
      this.notification.show('Account created successfully!', 'success');
      this.cdr.detectChanges();
    }, 500);
  }

  onStartShopping() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/shop';
    this.router.navigateByUrl(returnUrl);
  }

  onClose() {
    if (this.step === 'otp') {
      this.step = 'input';
      this.clearTimer();
    } else if (this.step === 'name') {
      this.step = 'otp';
    } else {
      this.router.navigate(['/']);
    }
  }
}
