import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SendOtp, OtpVerify } from '../../../core/model-class/login-signup';
import { Validations } from '../../../core/model-class/validations';
import { ApiService } from '../../../core/services/api.service';
import { DataService } from '../../../core/services/data.service';
import { JwtService } from '../../../core/services/jwt.service';
import { LoginService } from '../../../core/services/login.service';
import { NotificationService } from '../../../core/services/notificationnew.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { of, delay } from 'rxjs';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgOptimizedImage]
})
export class ForgotPasswordComponent implements OnInit {
  title = 'Forgot Password';
  subtitle = 'Enter your email address to receive a verification OTP';
  Email: string = '';
  activeLink: string = 'Login';
  isEmailSent: boolean = false;
  isOtpVerified: boolean = false;
  reset_token: string = '';
  otp: string = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading: boolean = false;

  ForgotForm!: FormGroup;
  loginAS!: number;
  email_pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiservice: ApiService,
    private dataService: DataService,
    private jwtService: JwtService,
    private loginService: LoginService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.ForgotForm = this.formBuilder.group(
      {
        Email: [
          '',
          [Validators.required, Validators.pattern(this.email_pattern)],
        ],
        OTP: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(6),
          ],
        ],
        Password: ['', [Validators.required, Validators.minLength(6)]],
        ConfirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator },
    );

    // Initially, only Email is required to proceed from step 1
    this.ForgotForm.get('OTP')?.disable();
    this.ForgotForm.get('Password')?.disable();
    this.ForgotForm.get('ConfirmPassword')?.disable();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('Password')?.value;
    const confirmPassword = form.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  openSecondsuccess: boolean = false;
  successName: any = '';
  errorMessage: any;
  submitted!: boolean;

  closeModal() {
    this.openSecondsuccess = false;
  }

  ForgetPasswordfun() {
    this.errorMessage = '';
    if (this.ForgotForm.get('Email')?.valid) {
      this.isLoading = true;
      const email = this.ForgotForm.get('Email')?.value;

      const body = {
        email: email,
        purpose: 'reset_password'
      };

      this.loginService.AdminForgetPasswordApi(body).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.status === 200 || response.status === true || response.success) {
            this.errorMessage = response.message || 'OTP sent successfully';
            this.notificationService.show(this.errorMessage, 'success', 3000);
            this.isEmailSent = true;
            this.title = 'Verify OTP';
            this.subtitle = 'We have sent a verification code to ' + email;

            // Enable and show other fields
            this.ForgotForm.get('OTP')?.enable();
            // Don't enable password fields yet
            // this.ForgotForm.get('Password')?.enable();
            // this.ForgotForm.get('ConfirmPassword')?.enable();
          } else {
            this.errorMessage = response.message || 'Failed to send OTP';
            this.notificationService.show(this.errorMessage, 'error', 3000);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || err.message || 'Server error occurred';
          this.notificationService.show(this.errorMessage, 'error', 3000);
        }
      });
    } else {
      this.ForgotForm.get('Email')?.markAsTouched();
      this.errorMessage = 'Please enter a valid email format';
      this.notificationService.show(this.errorMessage, 'error', 3000);
    }
  }

  VerifyOtpfun() {
    this.errorMessage = '';
    if (this.ForgotForm.get('OTP')?.valid) {
      this.isLoading = true;
      const email = this.ForgotForm.get('Email')?.value;
      const otp = this.ForgotForm.get('OTP')?.value;

      const verifyBody = {
        email: email,
        otp: otp,
        purpose: 'reset_password'
      };

      this.loginService.AdminVerifyOtpApi(verifyBody).subscribe({
        next: (verifyRes: any) => {
          this.isLoading = false;
          if (verifyRes.status === 200 || verifyRes.status === true || verifyRes.success) {
            
            this.reset_token = verifyRes.data?.reset_token || verifyRes.reset_token;
            this.isOtpVerified = true;
            this.title = 'Reset Password';
            this.subtitle = 'Create a new secure password';

            this.ForgotForm.get('OTP')?.disable(); // disable OTP field as it's no longer needed
            this.ForgotForm.get('Password')?.enable();
            this.ForgotForm.get('ConfirmPassword')?.enable();
            
            this.notificationService.show('OTP verified successfully!', 'success', 3000);
          } else {
            this.errorMessage = verifyRes.message || 'Invalid OTP';
            this.notificationService.show(this.errorMessage, 'error', 3000);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || err.message || 'Failed to verify OTP';
          this.notificationService.show(this.errorMessage, 'error', 3000);
        }
      });
    } else {
      this.ForgotForm.get('OTP')?.markAsTouched();
      this.errorMessage = 'Please enter a valid OTP';
      this.notificationService.show(this.errorMessage, 'error', 3000);
    }
  }

  ResetPasswordfun() {
    this.errorMessage = '';
    if (this.ForgotForm.valid) {
      this.isLoading = true;
      const email = this.ForgotForm.get('Email')?.value;
      const password = this.ForgotForm.get('Password')?.value;
      const confirmPassword = this.ForgotForm.get('ConfirmPassword')?.value;

      const resetBody = {
        email: email,
        reset_token: this.reset_token,
        password: password,
        password_confirmation: confirmPassword
      };

      this.loginService.AdminResetPassword(resetBody).subscribe({
        next: (resetRes: any) => {
          this.isLoading = false;
          if (resetRes.status === 200 || resetRes.status === true || resetRes.success) {
            this.notificationService.show(resetRes.message || 'Password reset successfully!', 'success', 3000);
            this.router.navigate(['/admin/login']);
          } else {
            this.errorMessage = resetRes.message || 'Failed to reset password';
            this.notificationService.show(this.errorMessage, 'error', 3000);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || err.message || 'Server error occurred during reset';
          this.notificationService.show(this.errorMessage, 'error', 3000);
        }
      });
    } else {
      this.ForgotForm.markAllAsTouched();
      if (this.ForgotForm.errors?.['mismatch']) {
        this.errorMessage = 'Passwords do not match';
      } else {
        this.errorMessage = 'Please fill all fields correctly';
      }
      this.notificationService.show(this.errorMessage, 'error', 3000);
    }
  }

  findInvalidControls(formName: any) {
    const invalid = [];
    const controls = formName.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }
}
