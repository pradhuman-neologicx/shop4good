import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { CustomerProfileService } from 'src/app/core/services/customer-profile.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ChooseCauseComponent, Cause } from '../choose-cause/choose-cause.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, FooterComponent,  ChooseCauseComponent],
  styleUrl: './customer-profile.component.scss',
  templateUrl: './customer-profile.component.html',
})
export class CustomerProfileComponent implements OnInit {
  Math = Math;
  profileForm!: FormGroup;
  otpForm!: FormGroup;

  user: any = null;
  isEditing = false;
  isLoading = false;

  // Supported Cause State
  supportedCause: Cause | null = null;
  isChooseCauseOpen = false;

  // Stores in "Where You Shop"
  stores = [
    { name: 'Amazon', orders: '12 orders', amount: '₹48,500', logo: 'assets/brands/amazon.svg' },
    { name: 'Flipkart', orders: '8 orders', amount: '₹31,200', logo: 'assets/brands/flipkart.svg' },
    { name: 'Myntra', orders: '5 orders', amount: '₹22,800', logo: 'assets/brands/myntra.svg' },
    { name: 'Tata CLiQ', orders: '4 orders', amount: '₹19,500', logo: 'assets/brands/tata-cliq.svg' }
  ];

  // Orders / Transactions State
  showOrdersTable: boolean = false;
  searchOrderQuery: string = '';
  orderStatusFilter: string = 'All';
  orderPage: number = 1;
  orderPageSize: number = 5;

  transactions = [
    {
      id: 'TRX-98237',
      store: 'Amazon',
      storeLogo: 'assets/brands/amazon.svg',
      date: '15 Mar 2024',
      productName: 'Eco-Friendly Bamboo Toothbrush Set',
      totalAmount: 499,
      donatedAmount: 50,
      cause: 'Kids Education',
      status: 'Completed'
    },
    {
      id: 'TRX-98210',
      store: 'Flipkart',
      storeLogo: 'assets/brands/flipkart.svg',
      date: '02 Mar 2024',
      productName: 'Organic Cotton Tote Bag',
      totalAmount: 299,
      donatedAmount: 30,
      cause: 'Women Empowerment',
      status: 'Completed'
    },
    {
      id: 'TRX-97554',
      store: 'Nykaa',
      storeLogo: 'assets/brands/nykaa.svg',
      date: '18 Feb 2024',
      productName: 'Recycled Paper Notebook Bundle',
      totalAmount: 750,
      donatedAmount: 150,
      cause: 'Kids Education',
      status: 'Pending'
    },
    {
      id: 'TRX-97102',
      store: 'Tata CLiQ',
      storeLogo: 'assets/brands/tata-cliq.svg',
      date: '25 Jan 2024',
      productName: 'Solar Powered Lantern',
      totalAmount: 1200,
      donatedAmount: 200,
      cause: 'Senior Citizen Care',
      status: 'Completed'
    },
    {
      id: 'TRX-96401',
      store: 'Amazon',
      storeLogo: 'assets/brands/amazon.svg',
      date: '10 Jan 2024',
      productName: 'Reusable Coffee Cup',
      totalAmount: 599,
      donatedAmount: 60,
      cause: 'Pet Care',
      status: 'Cancelled'
    },
    {
      id: 'TRX-95882',
      store: 'Flipkart',
      storeLogo: 'assets/brands/flipkart.svg',
      date: '05 Jan 2024',
      productName: 'Biodegradable Phone Case',
      totalAmount: 899,
      donatedAmount: 90,
      cause: 'Kids Education',
      status: 'Completed'
    }
  ];

  get filteredOrders() {
    let list = this.transactions;
    if (this.orderStatusFilter !== 'All') {
      list = list.filter((t) => t.status === this.orderStatusFilter);
    }
    if (this.searchOrderQuery.trim()) {
      const q = this.searchOrderQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.productName.toLowerCase().includes(q) ||
          t.store.toLowerCase().includes(q) ||
          t.cause.toLowerCase().includes(q)
      );
    }
    return list;
  }

  get paginatedOrders() {
    const start = (this.orderPage - 1) * this.orderPageSize;
    return this.filteredOrders.slice(start, start + this.orderPageSize);
  }

  get totalOrderPages() {
    return Math.ceil(this.filteredOrders.length / this.orderPageSize) || 1;
  }

  toggleOrdersTable(storeName?: string): void {
    this.showOrdersTable = true;
    if (storeName) {
      this.searchOrderQuery = storeName;
      this.orderStatusFilter = 'All';
      this.orderPage = 1;
    }
    this.cdr.markForCheck();
    setTimeout(() => {
      const el = document.getElementById('orders-table-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }

  setOrderStatus(status: string): void {
    this.orderStatusFilter = status;
    this.orderPage = 1;
    this.cdr.markForCheck();
  }

  prevOrderPage(): void {
    if (this.orderPage > 1) {
      this.orderPage--;
      this.cdr.markForCheck();
    }
  }

  nextOrderPage(): void {
    if (this.orderPage < this.totalOrderPages) {
      this.orderPage++;
      this.cdr.markForCheck();
    }
  }

  clearOrderFilters(): void {
    this.searchOrderQuery = '';
    this.orderStatusFilter = 'All';
    this.orderPage = 1;
    this.cdr.markForCheck();
  }

  // Modals state
  showOtpModal = false;
  otpChangeType: 'email' | 'phone' = 'email';
  pendingEmailUpdate = '';
  pendingPhoneUpdate = '';
  selectedAvatar: File | null = null;
  avatarPreview: string | null = null;

  // Messages
  successMessage = '';
  errorMessage = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private customerProfileService: CustomerProfileService,
    private notification: NotificationService,
    private jwtService: JwtService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadSupportedCause();
    this.loadUserData();
    this.fetchUserProfile();
  }

  initForms() {
    this.profileForm = this.fb.group({
      name: ['Umeed Singh', [Validators.required, Validators.minLength(2)]],
      email: ['ummeds@gmail.com', [Validators.required, Validators.email]],
      phone: ['98XXXXXX32', [Validators.required, Validators.pattern(/^[0-9X]{10}$/)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  loadUserData() {
    const cached = this.jwtService.getCustomerData();
    if (cached) {
      this.user = {
        name: cached.name || 'Umeed Singh',
        email: cached.email || 'ummeds@gmail.com',
        mobile: cached.mobile || cached.phone || '98XXXXXX32',
        avatar_url: cached.avatar_url || 'assets/images/umeed_singh.jpg'
      };
    } else {
      this.user = {
        name: 'Umeed Singh',
        email: 'ummeds@gmail.com',
        mobile: '98XXXXXX32',
        avatar_url: 'assets/images/umeed_singh.jpg'
      };
    }

    this.profileForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.mobile
    });
  }

  loadSupportedCause() {
    const saved = localStorage.getItem('shop4good_supported_cause');
    if (saved) {
      try {
        this.supportedCause = JSON.parse(saved);
      } catch {
        this.setDefaultCause();
      }
    } else {
      this.setDefaultCause();
    }
  }

  setDefaultCause() {
    this.supportedCause = {
      id: 'kids',
      title: 'Kids Education',
      subtitle: 'Brighter minds for a brighter tomorrow',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#1e3a8a'
    };
  }

  openChooseCause() {
    this.isChooseCauseOpen = true;
    this.cdr.markForCheck();
  }

  closeChooseCause() {
    this.isChooseCauseOpen = false;
    this.cdr.markForCheck();
  }

  onCauseSelected(cause: Cause) {
    this.supportedCause = cause;
    localStorage.setItem('shop4good_supported_cause', JSON.stringify(cause));
    this.isChooseCauseOpen = false;
    this.notification.show(`Cause changed to ${cause.title}`, 'success');
    this.cdr.markForCheck();
  }

  fetchUserProfile() {
    this.isLoading = true;
    this.customerProfileService.getProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res && (res.status === 200 || res.status === 'success' || res.status === 201 || res.code === 200)) {
          if (res.data) {
            this.user = {
              ...this.user,
              ...res.data,
              mobile: res.data.mobile || res.data.phone || this.user.mobile,
              avatar_url: res.data.avatar_url || this.user.avatar_url
            };
            this.jwtService.saveCustomerData(this.user);
            this.profileForm.patchValue({
              name: this.user.name,
              email: this.user.email,
              phone: this.user.mobile
            });
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.patchValue({
        name: this.user?.name || 'Umeed Singh',
        email: this.user?.email || 'ummeds@gmail.com',
        phone: this.user?.mobile || '98XXXXXX32'
      });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      this.profileForm.patchValue({
        name: this.user?.name || 'Umeed Singh',
        email: this.user?.email || 'ummeds@gmail.com',
        phone: this.user?.mobile || '98XXXXXX32'
      });
      this.selectedAvatar = null;
      this.avatarPreview = null;
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    this.cdr.markForCheck();
  }

  onSaveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.notification.show('Please fill all required fields correctly', 'error');
      return;
    }

    const formValues = this.profileForm.value;
    this.user = {
      ...this.user,
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      mobile: formValues.phone.trim(),
      avatar_url: this.avatarPreview || this.user?.avatar_url || 'assets/images/umeed_singh.jpg'
    };

    this.jwtService.saveCustomerData(this.user);
    this.isEditing = false;
    this.notification.show('Profile updated successfully!', 'success');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.cdr.detectChanges();
  }

  onChangeEmail() {
    const emailControl = this.profileForm.get('email');
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      this.notification.show('Please enter a valid email address first', 'error');
      return;
    }
    this.pendingEmailUpdate = emailControl.value;
    this.otpChangeType = 'email';
    this.otpForm.reset();
    this.showOtpModal = true;
    this.notification.show(`OTP sent to ${this.pendingEmailUpdate} (Use code: 123456)`, 'info');
    this.cdr.detectChanges();
  }

  onChangePhone() {
    const phoneControl = this.profileForm.get('phone');
    if (!phoneControl || phoneControl.invalid) {
      phoneControl?.markAsTouched();
      this.notification.show('Please enter a valid 10-digit mobile number first', 'error');
      return;
    }
    this.pendingPhoneUpdate = phoneControl.value;
    this.otpChangeType = 'phone';
    this.otpForm.reset();
    this.showOtpModal = true;
    this.notification.show(`OTP sent to +91 ${this.pendingPhoneUpdate} (Use code: 123456)`, 'info');
    this.cdr.detectChanges();
  }

  verifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const otp = this.otpForm.get('otp')?.value;
    if (otp !== '123456' && otp?.length !== 6) {
      this.notification.show('Invalid OTP. Use code: 123456', 'error');
      return;
    }

    if (this.otpChangeType === 'email') {
      this.user = {
        ...this.user,
        email: this.pendingEmailUpdate
      };
      this.profileForm.patchValue({ email: this.pendingEmailUpdate });
    } else {
      this.user = {
        ...this.user,
        mobile: this.pendingPhoneUpdate
      };
      this.profileForm.patchValue({ phone: this.pendingPhoneUpdate });
    }

    this.jwtService.saveCustomerData(this.user);
    this.showOtpModal = false;
    this.otpForm.reset();
    this.notification.show(
      `${this.otpChangeType === 'email' ? 'Email' : 'Mobile number'} verified & updated successfully!`, 
      'success'
    );
    this.cdr.detectChanges();
  }

  closeOtpModal() {
    this.showOtpModal = false;
    this.otpForm.reset();
    this.pendingEmailUpdate = '';
    this.pendingPhoneUpdate = '';
    this.cdr.detectChanges();
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
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
