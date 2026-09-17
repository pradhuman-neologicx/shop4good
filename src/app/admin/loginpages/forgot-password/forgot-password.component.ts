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
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink]
})
export class ForgotPasswordComponent implements OnInit {
  title = 'Forgot Password';
  subtitle = 'Enter your email address to receive a verification OTP';
  Email: string = '';
  activeLink: string = 'Login';
  isEmailSent: boolean = false;
  otp: string = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading: boolean = false;

  ForgotForm!: FormGroup;
  loginAS!: number;
  email_pattern = '^[A-Za-z0-9_.]+@[a-zA-Z]+(\\.[a-zA-Z]{2,4})+$';

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
      const formData: FormData = new FormData();
      formData.append('email', this.ForgotForm.get('Email')?.value);

      this.loginService.AdminForgetPasswordApi(formData).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.errorMessage = response.message;
          if (response.status === 200) {
            this.notificationService.show(response.message, 'success', 3000);
            this.isEmailSent = true;
            this.title = 'Verify OTP';
            this.subtitle =
              'We have sent a verification code to ' +
              this.ForgotForm.get('Email')?.value;

            // Enable and show other fields
            this.ForgotForm.get('OTP')?.enable();
            this.ForgotForm.get('Password')?.enable();
            this.ForgotForm.get('ConfirmPassword')?.enable();
          } else {
            this.notificationService.show(
              response.message || 'Something went wrong',
              'error',
              3000,
            );
            this.submitted = false;
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.message || 'Something went wrong';
          this.notificationService.show(this.errorMessage, 'error', 3000);
        },
      );
    } else {
      this.ForgotForm.get('Email')?.markAsTouched();
      this.errorMessage = 'Please enter a valid email address';
      this.notificationService.show(this.errorMessage, 'error', 3000);
    }
  }

  ResetPasswordfun() {
    this.errorMessage = '';
    if (this.ForgotForm.valid) {
      this.isLoading = true;
      const formData: FormData = new FormData();
      formData.append('email', this.ForgotForm.get('Email')?.value);
      formData.append('otp', this.ForgotForm.get('OTP')?.value);
      formData.append('password', this.ForgotForm.get('Password')?.value);
      formData.append(
        'password_confirmation',
        this.ForgotForm.get('ConfirmPassword')?.value,
      );

      this.loginService.AdminResetPassword(formData).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.errorMessage = response.message;
          if (response.status === 200) {
            this.notificationService.show(response.message, 'success', 3000);
            this.router.navigate(['/sign_in']);
          } else {
            this.notificationService.show(
              response.message || 'Reset failed',
              'error',
              3000,
            );
            this.submitted = false;
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.message || 'Reset failed';
          this.notificationService.show(this.errorMessage, 'error', 3000);
        },
      );
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
