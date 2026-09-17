import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [
        trigger('succesfullyMesaage', [
            state('void', style({
                transform: 'translateX(-30%)',
                opacity: 0,
            })),
            transition(':enter, :leave', [
                animate('0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)'),
            ]),
        ]),
        trigger('slideIn', [
            state('void', style({
                transform: 'translateX(100%)',
                opacity: 0,
            })),
            transition(':enter', [
                animate('0.5s ease-out', style({
                    transform: 'translateX(0)',
                    opacity: 1,
                })),
            ]),
        ]),
        trigger('fadeSlide', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(12px)' }),
                animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, NgClass, RouterLink, NgOptimizedImage]
})
export class SigninComponent implements OnInit {
  title = 'Login';

  // ── Forms ──
  signIn!: FormGroup;

  // ── UI state ──
  openSecondsuccess: boolean = false;
  successName: any = '';
  errorMessage: any = '';
  showErrorMessage: boolean = false;
  submitted!: boolean;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: ApiService,
    private dataService: DataService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.signIn = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ══════════════════════════════════════════
  // Login — Simulated for now
  // ══════════════════════════════════════════
  onLogin() {
    this.errorMessage = '';
    if (this.signIn.valid) {
      this.isLoading = true;
      const { email, password } = this.signIn.value;

      // The API code is already there, keep it commented because it will be useful later
      // this.apiservice.post('auth/login', { email, password }).subscribe({
      //   next: (res: any) => {
      //     this.isLoading = false;
      //     if (res.status === 200) {
      //       this.handleLoginSuccess(res);
      //     } else {
      //       this.notificationService.show(res.message || 'Login failed', 'error');
      //       this.errorMessage = res.message || 'Login failed';
      //     }
      //   },
      //   error: (err: any) => {
      //     this.isLoading = false;
      //     this.errorMessage = err.message || 'Server error occurred';
      //   }
      // });

      // Dummy Data for Authentication
      setTimeout(() => {
        this.isLoading = false;
        
        // Mock authentication check
        if (email === 'admin@admin.com' && password === 'admin123') {
          const dummyResponse = {
            status: 200,
            data: {
              user: {
                id: 1,
                name: 'Super Admin',
                role: 'Super Admin'
              },
              token: 'dummy-jwt-token-for-local-dev-12345'
            }
          };
          this.handleLoginSuccess(dummyResponse);
        } else {
          this.notificationService.show('Invalid email or password', 'error');
          this.errorMessage = 'Invalid email or password';
        }
      }, 1000);
    } else {
      if (this.signIn.get('email')?.hasError('email')) {
        this.notificationService.show('Please enter a valid email format', 'error');
        this.errorMessage = 'Please enter a valid email format';
      } else {
        this.notificationService.show('Please fix the errors in the form', 'error');
        this.errorMessage = 'Please fix the errors in the form';
      }
      this.markAllAsTouched();
    }
  }

  handleLoginSuccess(response: any) {
    this.submitted = true;
    this.successName = 'Login';
    const loginData = response.data;

    setTimeout(() => {
      this.openSecondsuccess = true;
      setTimeout(() => {
        this.openSecondsuccess = false;
        this.jwtService.savepanelUserId(loginData.user.id);
        this.jwtService.saveadminame(loginData.user.name);
        this.jwtService.saveAdminToken(loginData.token);
        this.jwtService.saveAdminRole(loginData.user.role);
        this.jwtService.isLoggedIn(true);
        this.router.navigate(['/admin/dashboard']);
      }, 1800);
    }, 200);
  }

  // ── Utility ──
  closeModal() {
    this.openSecondsuccess = false;
  }

  markAllAsTouched() {
    for (const control in this.signIn.controls) {
      if (this.signIn.controls.hasOwnProperty(control)) {
        this.signIn.controls[control].markAsTouched();
      }
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
    return invalid;
  }

  ngOnDestroy() {
    // No intervals to clear anymore
  }
}
