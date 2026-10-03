import { NgOptimizedImage, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicApiService } from 'src/app/core/services/public-api.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ReactiveFormsModule, NgClass],
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  showPassword = false;
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  isLoading = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private publicApiService: PublicApiService,
    private jwtService: JwtService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const payload = {
      mobile_no: this.loginForm.value.mobile,
      password: this.loginForm.value.password
    };

    this.publicApiService.customerLogin(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && (res.status === 200 || res.status === 'success' || res.status === 201 || res.code === 200)) {
          // Save real user data in localStorage
          this.jwtService.setCustomerIsLoggedIn(true);
          this.jwtService.saveCustomerToken(res.data.token);
          this.jwtService.saveCustomerData(res.data.user);
          this.jwtService.saveCustomerId(res.data.user.id);
          
          this.notification.show('Logged in successfully!', 'success');
          this.router.navigate(['/profile']);
        } else {
          this.errorMessage = res.message || 'Invalid mobile number or password.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        
        // Since ApiService throws a JS Error object, extract the message safely
        // this.errorMessage = err?.message || 'Invalid mobile number or password.';
        this.cdr.detectChanges();
      }
    });
  }
}
