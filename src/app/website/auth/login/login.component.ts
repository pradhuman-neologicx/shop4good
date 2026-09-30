import { NgOptimizedImage, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

    const { email, password } = this.loginForm.value;

    // Dummy credential check
    if (email === 'customer@shop4good.com' && password === 'customer123') {
      // Save dummy user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        name: 'Neo Matrix',
        email: email,
        role: 'customer'
      }));
      // Redirect to home on success
      this.router.navigate(['/']);
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }
}
