import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CustomerProfileService } from 'src/app/core/services/customer-profile.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { PublicApiService } from 'src/app/core/services/public-api.service';
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent, RouterLink, NgSelectModule],
  styleUrl: './customer-profile.component.scss',
  templateUrl: './customer-profile.component.html',
})
export class CustomerProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  otpForm!: FormGroup;

  user: any = null;
  isEditing = false;
  isLoading = false;
  activeTab = 'personal';

  // Modals state
  showOtpModal = false;
  showPasswordModal = false;
  
  // Password visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  pendingEmailUpdate = '';
  selectedAvatar: File | null = null;
  avatarPreview: string | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';

  // Location Real Data
  allStates: any[] = [];
  states: any[] = [];
  cities: any[] = [];



  // Transactions Mock Data
  Math = Math;
  transactions = [
    { id: 'TRX-98237', date: '15 Mar 2024', productName: 'Eco-Friendly Bamboo Toothbrush Set', totalAmount: 499, donatedAmount: 50, cause: 'Clean Oceans Initiative', status: 'Completed' },
    { id: 'TRX-98210', date: '02 Mar 2024', productName: 'Organic Cotton Tote Bag', totalAmount: 299, donatedAmount: 30, cause: 'Girl Child Education', status: 'Completed' },
    { id: 'TRX-97554', date: '18 Feb 2024', productName: 'Recycled Paper Notebook Bundle', totalAmount: 750, donatedAmount: 150, cause: 'Save The Trees Foundation', status: 'Pending' },
    { id: 'TRX-97102', date: '25 Jan 2024', productName: 'Solar Powered Lantern', totalAmount: 1200, donatedAmount: 200, cause: 'Rural Electrification', status: 'Completed' },
    { id: 'TRX-96401', date: '10 Jan 2024', productName: 'Reusable Coffee Cup', totalAmount: 599, donatedAmount: 60, cause: 'Forest Conservation', status: 'Cancelled' },
    { id: 'TRX-95882', date: '05 Jan 2024', productName: 'Biodegradable Phone Case', totalAmount: 899, donatedAmount: 90, cause: 'Wildlife Protection', status: 'Completed' }
  ];
  showFilters = false;
  searchQuery = '';
  activeSearchQuery = '';
  statusFilter = 'All';
  dateFilter = 'All';
  causeFilter = 'All';
  currentPage = 1;
  itemsPerPage = 4;

  get uniqueCauses() {
    return Array.from(new Set(this.transactions.map(t => t.cause)));
  }

  get filteredTransactions() {
    let list = this.transactions;
    if (this.statusFilter !== 'All') list = list.filter(t => t.status === this.statusFilter);
    if (this.causeFilter !== 'All') list = list.filter(t => t.cause === this.causeFilter);
    if (this.dateFilter !== 'All') {
      const cutoff = new Date('2024-03-30');
      if (this.dateFilter === 'Last 30 Days') cutoff.setDate(cutoff.getDate() - 30);
      else if (this.dateFilter === 'Last 6 Months') cutoff.setMonth(cutoff.getMonth() - 6);
      else if (this.dateFilter === 'Last Year') cutoff.setFullYear(cutoff.getFullYear() - 1);
      list = list.filter(t => new Date(t.date) >= cutoff);
    }
    if (this.activeSearchQuery.trim() !== '') {
      const q = this.activeSearchQuery.toLowerCase();
      list = list.filter(t => t.productName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.cause.toLowerCase().includes(q));
    }
    return list;
  }

  get paginatedTransactions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage) || 1;
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  triggerSearch() {
    this.activeSearchQuery = this.searchQuery;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchQuery = '';
    this.activeSearchQuery = '';
    this.statusFilter = 'All';
    this.dateFilter = 'All';
    this.causeFilter = 'All';
    this.currentPage = 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private customerProfileService: CustomerProfileService,
    private notification: NotificationService,
    private jwtService: JwtService,
    private loginService: LoginService,
    private publicApiService: PublicApiService
  ) {}

  ngOnInit() {
    this.initForms();
    this.setupLocationListeners();
    this.loadStates();
    this.fetchUserProfile();
  }

  loadStates() {
    this.publicApiService.getStates().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.states = res.data || [];
        // After loading states, if user is already fetched and has a state ID, load cities.
        if (this.user && this.user.state_id) {
          this.loadCities(this.user.state_id);
        }
      },
      error: (err) => console.error(err)
    });
  }

  private lastLoadedStateId: number | null = null;

  loadCities(stateId: number) {
    if (this.lastLoadedStateId === stateId && this.cities.length > 0) {
      return; // Prevent duplicate API calls for the same state
    }
    this.lastLoadedStateId = stateId;
    this.publicApiService.getCitiesByState(stateId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.cities = res.data || [];
      },
      error: (err) => {
        console.error(err);
        this.lastLoadedStateId = null; // Reset on error so it can be retried
      }
    });
  }

  initForms() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      // countryCode: ['+91', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  private previousStateId: number | null = null;

  setupLocationListeners() {
    this.profileForm.get('state')?.valueChanges.subscribe(stateId => {
      if (!this.isEditing) return; // Do not fetch cities during initial load/view mode

      const currentId = stateId ? Number(stateId) : null;
      
      if (currentId) {
        this.loadCities(currentId);
      } else {
        this.cities = [];
      }
      
      // Only clear city selection if the state ACTUALLY changed by the user.
      // This prevents the city from wiping out when toggleEdit calls .enable()
      if (this.previousStateId !== null && this.previousStateId !== currentId) {
        this.profileForm.get('city')?.setValue('');
      }
      this.previousStateId = currentId;
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  fetchUserProfile() {
    this.isLoading = true;
    this.customerProfileService.getProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res && (res.status === 200 || res.status === 'success' || res.status === 201 || res.code === 200)) {
          this.user = res.data;
          this.user.countryCode = '+91'; // default as per mock logic
          
          this.jwtService.saveCustomerData(this.user); // Sync local storage with fresh API data
          
          let formState = this.user.state;
          let formCity = this.user.city;
          
          if (this.user.state && typeof this.user.state === 'object') {
            formState = this.user.state.id;
          } else if (this.user.state_id) {
            formState = this.user.state_id;
          }
          if (this.user.city && typeof this.user.city === 'object') {
            formCity = this.user.city.id;
          } else if (this.user.city_id) {
            formCity = this.user.city_id;
          }
          
          // Cities are deferred until Edit is clicked, so we don't call this.loadCities(formState) here anymore.

          this.profileForm.patchValue({
            ...this.user,
            phone: this.user.mobile || '', // Map backend mobile to frontend phone
            address: this.user.address || '',
            state: formState,
            city: formCity
          });
          this.profileForm.disable();
        } else {
          this.notification.show(res.message || 'Failed to fetch profile', 'error');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        // this.notification.show(err.message || 'Failed to fetch profile', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      
      // Explicitly load cities for the current state to populate the dropdown 
      // without wiping the prefilled city ID
      const currentState = this.profileForm.get('state')?.value;
      if (currentState) {
        this.previousStateId = Number(currentState);
        this.loadCities(Number(currentState));
      }
    } else {
      this.selectedAvatar = null;
      this.avatarPreview = null;
      
      this.profileForm.disable();
      let formState = this.user.state;
      let formCity = this.user.city;
      
      if (this.user.state && typeof this.user.state === 'object') {
        formState = this.user.state.id;
      } else if (this.user.state_id) {
        formState = this.user.state_id;
      }
      if (this.user.city && typeof this.user.city === 'object') {
        formCity = this.user.city.id;
      } else if (this.user.city_id) {
        formCity = this.user.city_id;
      }
      
      if (formState) {
        this.loadCities(formState);
      }
      
      this.profileForm.patchValue({
        ...this.user,
        phone: this.user.mobile || '', // Map backend mobile to frontend phone
        address: this.user.address || '',
        state: formState,
        city: formCity
      });
    }
    this.clearMessages();
  }

  onSaveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValues = this.profileForm.value;

    if (formValues.email !== this.user.email) {
      this.pendingEmailUpdate = formValues.email;
      this.triggerEmailVerification();
      return;
    }

    this.updateUser(formValues);
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    const otp = this.otpForm.get('otp')?.value;
    
    // Instead of verifying here, the backend consumes it in the updateProfile API as verification_token.
    this.showOtpModal = false;
    this.otpForm.reset();
    
    const updatedData = { ...this.profileForm.value, email: this.pendingEmailUpdate, verification_token: otp };
    this.updateUser(updatedData);
  }

  updateUser(data: any) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobile', data.phone || data.mobile || '');
    if (data.verification_token) {
      formData.append('verification_token', data.verification_token);
    }
    // We send state and city names just as text
    if (data.state) formData.append('state', data.state);
    if (data.city) formData.append('city', data.city);
    if (data.address) formData.append('address', data.address);
    if (data.gender) formData.append('gender', data.gender);
    
    if (this.selectedAvatar) {
      formData.append('avatar', this.selectedAvatar);
    }

    this.customerProfileService.updateProfile(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res && (res.status === 200 || res.status === 'success' || res.status === 201 || res.code === 200)) {
          this.isEditing = false;
          this.profileForm.disable();
          this.selectedAvatar = null;
          this.avatarPreview = null;
          this.pendingEmailUpdate = '';
          
          this.notification.show('Profile updated successfully!', 'success');
          
          // Fetch fresh data from API to ensure everything (like avatar URL) is perfectly synced
          this.fetchUserProfile();
        } else {
          this.notification.show(res.message || 'Failed to update profile', 'error');
          this.isLoading = false;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        // this.notification.show(err.message || 'Error updating profile', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    this.passwordForm.reset();
    this.clearMessages();
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  onChangePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    this.isLoading = true;
    const payload = {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword
    };

    this.customerProfileService.changePassword(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && (res.status === 200 || res.status === 'success' || res.status === 201 || res.code === 200)) {
          this.showPasswordModal = false;
          this.notification.show(res.message || 'Password changed successfully!', 'success');
          
          // Clear storage and redirect to login
          this.jwtService.clearCustomerStorage();
          this.router.navigate(['/auth/login']); 
        } else {
          this.notification.show(res.message || 'Failed to change password', 'error');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        // this.notification.show(err.message || 'Failed to change password', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  closeOtpModal() {
    this.showOtpModal = false;
    this.pendingEmailUpdate = '';
  }

  showMessage(msg: string, isError = false) {
    if (isError) this.errorMessage = msg;
    else this.successMessage = msg;
    setTimeout(() => this.clearMessages(), 5000);
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  triggerEmailVerification() {
    const newEmail = this.profileForm.get('email')?.value;
    if (newEmail && newEmail !== this.user.email) {
      this.pendingEmailUpdate = newEmail;
      this.isLoading = true;
      
      this.loginService.AdminForgetPasswordApi({ email: newEmail, purpose: 'update' }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res && res.status === 200) {
            this.showOtpModal = true;
            this.notification.show('OTP sent to your new email', 'success');
          } else {
            this.notification.show(res.message || 'Failed to send OTP', 'error');
          }
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.isLoading = false;
          // this.notification.show(err.message || 'Failed to send OTP', 'error');
          this.cdr.detectChanges();
        }
      });
    }
  }

  logout() {
    this.customerProfileService.logout().subscribe({
      next: () => {
        this.jwtService.clearCustomerStorage();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.jwtService.clearCustomerStorage();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedAvatar = file;
      
      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
