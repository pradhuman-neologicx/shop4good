import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouterLink, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent, RouterLink],
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

  pendingEmailUpdate = '';

  // Messages
  successMessage = '';
  errorMessage = '';

  // Location Mock Data
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

  // Mock activity
  recentActivity = [
    { icon: 'fa-bag-shopping', text: 'Purchased Eco-Friendly Water Bottle', time: '2 hours ago', color: 'emerald' },
    { icon: 'fa-hand-holding-heart', text: 'Donated ₹500 to Clean Water Initiative', time: '1 day ago', color: 'blue' },
    { icon: 'fa-star', text: 'Left a review on Organic Tote Bag', time: '3 days ago', color: 'amber' },
    { icon: 'fa-bag-shopping', text: 'Purchased Bamboo Cutlery Set', time: '1 week ago', color: 'emerald' },
  ];

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

  constructor(private fb: FormBuilder, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.initForms();
    this.setupLocationListeners();
    this.fetchUserProfile();
  }

  initForms() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', [Validators.required]],
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

  setupLocationListeners() {
    this.profileForm.get('countryCode')?.valueChanges.subscribe(countryCode => {
      if (countryCode) {
        this.states = this.allStates.filter(s => s.countryCode === countryCode);
      } else {
        this.states = [];
      }
      if (this.isEditing) {
        this.profileForm.get('state')?.setValue('');
        this.profileForm.get('city')?.setValue('');
        this.cities = [];
      }
    });

    this.profileForm.get('state')?.valueChanges.subscribe(stateName => {
      if (stateName) {
        this.cities = this.allCities.filter(c => c.stateName === stateName);
      } else {
        this.cities = [];
      }
      if (this.isEditing) {
        this.profileForm.get('city')?.setValue('');
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  fetchUserProfile() {
    this.isLoading = true;
    setTimeout(() => {
      let stored = null;
      try {
        if (typeof window !== 'undefined') {
          stored = localStorage.getItem('currentUser');
        }
      } catch (e) {}
      
      if (stored) {
        this.user = JSON.parse(stored);
        this.user.countryCode = this.user.countryCode || '+91';
        this.user.phone = this.user.phone || '9876543210';
        this.user.state = this.user.state || 'Delhi';
        this.user.city = this.user.city || 'New Delhi';
        this.user.address = this.user.address || '123 Goodness Lane, Appt 4B';
      } else {
        this.user = {
          name: 'John Doe',
          email: 'customer@shop4good.com',
          countryCode: '+91',
          phone: '9876543210',
          state: 'Delhi',
          city: 'New Delhi',
          address: '123 Goodness Lane, Appt 4B',
          role: 'customer'
        };
      }

      this.states = this.allStates.filter(s => s.countryCode === this.user.countryCode);
      this.cities = this.allCities.filter(c => c.stateName === this.user.state);

      this.profileForm.patchValue(this.user);
      this.profileForm.disable();
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 800);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.states = this.allStates.filter(s => s.countryCode === this.user.countryCode);
      this.cities = this.allCities.filter(c => c.stateName === this.user.state);
      this.profileForm.patchValue(this.user);
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
      this.showOtpModal = true;
      return;
    }

    this.updateUser(formValues);
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    const otp = this.otpForm.get('otp')?.value;

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      if (otp === '123456') {
        this.showOtpModal = false;
        this.otpForm.reset();
        const updatedData = { ...this.profileForm.value, email: this.pendingEmailUpdate };
        this.updateUser(updatedData);
      } else {
        this.otpForm.get('otp')?.setErrors({ invalid: true });
      }
    }, 1000);
  }

  updateUser(data: any) {
    this.isLoading = true;
    setTimeout(() => {
      this.user = { ...this.user, ...data };
      localStorage.setItem('currentUser', JSON.stringify(this.user));

      this.isEditing = false;
      this.profileForm.disable();
      this.isLoading = false;
      this.showMessage('Profile updated successfully!');
    }, 800);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    this.passwordForm.reset();
    this.clearMessages();
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  onChangePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword } = this.passwordForm.value;

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      if (currentPassword !== 'customer123') {
        this.passwordForm.get('currentPassword')?.setErrors({ incorrect: true });
        return;
      }
      this.showPasswordModal = false;
      this.showMessage('Password changed successfully!');
    }, 1000);
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
      this.showOtpModal = true;
    }
  }

  logout() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUser');
      }
    } catch (e) {}
    this.router.navigate(['/auth/login']);
  }
}
