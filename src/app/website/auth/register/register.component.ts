import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  passwordFocused = false;
  submitted = false;

  // Custom Mock Data
  allCountries = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' }
  ];

  allStates = [
    { name: 'Maharashtra', countryCode: '+91' },
    { name: 'Delhi', countryCode: '+91' },
    { name: 'Karnataka', countryCode: '+91' },
    { name: 'California', countryCode: '+1' },
    { name: 'New York', countryCode: '+1' },
    { name: 'London', countryCode: '+44' }
  ];

  allCities = [
    { name: 'Mumbai', stateName: 'Maharashtra' },
    { name: 'Pune', stateName: 'Maharashtra' },
    { name: 'New Delhi', stateName: 'Delhi' },
    { name: 'Bengaluru', stateName: 'Karnataka' },
    { name: 'Los Angeles', stateName: 'California' },
    { name: 'New York City', stateName: 'New York' },
    { name: 'Westminster', stateName: 'London' }
  ];

  countries = this.allCountries;
  states: any[] = [];
  cities: any[] = [];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {
    // Initial states for the default country (+91)
    this.states = this.allStates.filter(s => s.countryCode === '+91');

    this.registerForm.get('countryCode')?.valueChanges.subscribe(countryCode => {
      this.registerForm.get('state')?.setValue('');
      this.registerForm.get('city')?.setValue('');
      
      if (countryCode) {
        this.states = this.allStates.filter(s => s.countryCode === countryCode);
      } else {
        this.states = [];
      }
      this.cities = [];
    });

    this.registerForm.get('state')?.valueChanges.subscribe(stateName => {
      this.registerForm.get('city')?.setValue('');
      
      if (stateName) {
        this.cities = this.allCities.filter(c => c.stateName === stateName);
      } else {
        this.cities = [];
      }
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

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    console.log('Form Submitted', this.registerForm.value);
    // Handle registration logic here
  }
}
