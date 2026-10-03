import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MarketplaceService } from 'src/app/core/services/marketplace.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-marketplaces',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  styleUrls: ['./marketplaces.component.scss'],
  templateUrl: './marketplaces.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketplacesComponent implements OnInit {
  marketplaces: any[] = [];
  isLoading = true;
  
  // Pagination & Filters
  page = 1;
  limit = 10;
  total = 0;
  searchQuery = '';
  filterStatus = 'All';

  // Modal state
  isModalOpen = false;
  isEditMode = false;
  isViewMode = false;
  currentId: number | null = null;
  
  marketForm!: FormGroup;
  submitted = false;
  logoFile: File | null = null;

  // Regex for URL validation
  urlRegex = /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/;

  private destroyRef = inject(DestroyRef);

  constructor(
    private marketplaceService: MarketplaceService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadMarketplaces();
  }

  initForm() {
    this.marketForm = this.fb.group({
      name: ['', Validators.required],
      website_url: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
      short_description: [''],
      description: [''],
      is_featured: [false],
      sort_order: [1],
      imageUrl: [''],
      trackingParam: [''],
      status: ['Active', Validators.required]
    });
  }

  loadMarketplaces() {
    this.isLoading = true;
    this.cdr.markForCheck();
    const params = { page: this.page, per_page: this.limit, search: this.searchQuery, filter: this.filterStatus };
    this.marketplaceService.getAdminMarketplaces(params)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.marketplaces = res.data.items;
        this.total = res.data.meta.total;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load marketplaces', 'error');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get showingFrom() {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get showingTo() {
    return Math.min(this.page * this.limit, this.total);
  }

  onSearch() {
    this.page = 1;
    this.loadMarketplaces();
  }

  resetSearch() {
    this.searchQuery = '';
    this.page = 1;
    this.loadMarketplaces();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadMarketplaces();
  }

  onLimitChange() {
    this.page = 1; // Reset to first page
    this.loadMarketplaces();
  }

  onFilterChange() {
    this.page = 1;
    this.loadMarketplaces();
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.currentId = null;
    this.submitted = false;
    this.logoFile = null;
    this.marketForm.reset({ status: 'Active' });
    this.marketForm.enable();
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }

  openEditModal(item: any) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.currentId = item.id;
    this.submitted = false;
    this.logoFile = null;
    this.marketForm.reset({ status: 'Active' });
    this.marketForm.enable();
    
    this.marketplaceService.getAdminMarketplaceById(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res.data;
        const patchData = {
          ...data,
          status: data.is_active ? 'Active' : 'Inactive',
          imageUrl: data.logo_url || '',
          trackingParam: data.affiliate_config?.tracking_param || ''
        };
        this.marketForm.patchValue(patchData);
        this.marketForm.enable();
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load marketplace details', 'error');
      }
    });
  }

  viewMarketplace(item: any) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.currentId = item.id;
    this.submitted = false;
    this.logoFile = null;
    this.marketForm.reset({ status: 'Active' });
    this.marketForm.disable(); // Disable immediately while loading
    
    this.marketplaceService.getAdminMarketplaceById(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res.data;
        const patchData = {
          ...data,
          status: data.is_active ? 'Active' : 'Inactive',
          imageUrl: data.logo_url || '',
          trackingParam: data.affiliate_config?.tracking_param || ''
        };
        this.marketForm.patchValue(patchData);
        this.marketForm.disable(); // Disable the form for view mode
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load marketplace details', 'error');
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.marketForm.reset({ status: 'Active' });
    this.cdr.markForCheck();
  }

  onSubmit() {
    this.submitted = true;
    if (this.marketForm.invalid) {
      return;
    }

    const data = this.marketForm.getRawValue();
    // Prepare API payload via FormData
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('website_url', data.website_url);
    formData.append('short_description', data.short_description || '');
    formData.append('description', data.description || '');
    formData.append('is_featured', data.is_featured ? '1' : '0');
    formData.append('sort_order', data.sort_order?.toString() || '1');
    formData.append('tracking_param', data.trackingParam || '');
    
    if (this.logoFile) { 
      formData.append('logo', this.logoFile); 
    }

    if (this.isEditMode && this.currentId) {
      formData.append('_method', 'PUT');
      this.marketplaceService.updateAdminMarketplace(this.currentId, formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message || 'Updated successfully', 'success');
          this.loadMarketplaces();
          this.closeModal();
        },
        error: (err) => {
          // this.notification.show('Update failed', 'error');
        }
      });
    } else {
      this.marketplaceService.addAdminMarketplace(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message || 'Added successfully', 'success');
          this.loadMarketplaces();
          this.closeModal();
        },
        error: (err) => {
          // this.notification.show('Add failed', 'error');
        }
      });
    }
  }

  toggleStatus(item: any) {
    const newStatus = item.is_active ? 0 : 1;
    this.marketplaceService.toggleAdminMarketplaceStatus(item.id, { is_active: newStatus }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(res.message || 'Status updated', 'success');
        this.loadMarketplaces();
      },
      error: () => {
        this.notification.show('Failed to update status', 'error');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.marketForm.patchValue({ imageUrl: e.target.result });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting same file again if needed
      event.target.value = '';
    }
  }
}
