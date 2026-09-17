import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
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

  // Regex for URL validation
  urlRegex = /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/;

  private destroyRef = inject(DestroyRef);

  constructor(
    private mockApi: AdminMockApiService,
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
      associateUrl: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
      imageUrl: [''],
      trackingParam: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  loadMarketplaces() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.mockApi.getMarketplaces(this.page, this.limit, this.searchQuery, this.filterStatus)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.marketplaces = res.data;
        this.total = res.pagination.total;
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
    this.marketForm.reset({ status: 'Active' });
    this.marketForm.enable();
    this.isModalOpen = true;
  }

  openEditModal(item: any) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.currentId = item.id;
    this.submitted = false;
    this.marketForm.patchValue(item);
    this.marketForm.enable();
    this.isModalOpen = true;
  }

  viewMarketplace(item: any) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.currentId = item.id;
    this.submitted = false;
    this.marketForm.patchValue(item);
    this.marketForm.disable(); // Disable the form for view mode
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.marketForm.invalid) {
      return;
    }

    const data = this.marketForm.getRawValue();
    if (this.isEditMode && this.currentId) {
      this.mockApi.updateMarketplace(this.currentId, data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message, 'success');
          this.loadMarketplaces();
          this.closeModal();
        }
      });
    } else {
      this.mockApi.addMarketplace(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message, 'success');
          this.loadMarketplaces();
          this.closeModal();
        }
      });
    }
  }

  toggleStatus(item: any) {
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    const updatedData = { ...item, status: newStatus };
    this.mockApi.updateMarketplace(item.id, updatedData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(`Marketplace status changed to ${newStatus}`, 'success');
        this.loadMarketplaces();
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.marketForm.patchValue({ imageUrl: e.target.result });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
