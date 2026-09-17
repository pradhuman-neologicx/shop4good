import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule, NgSelectModule],
  styleUrls: ['./users.component.scss'],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  causesList: any[] = [];
  isLoading = true;
  
  // Pagination & Filters
  page = 1;
  limit = 10;
  total = 0;
  searchQuery = '';
  filterStatus = 'All';
  filterCause: string | null = null;

  // Modal state
  isModalOpen = false;
  isEditMode = false;
  isViewMode = false;
  currentUserId: number | null = null;
  
  userForm!: FormGroup;
  submitted = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private mockApi: AdminMockApiService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadCauses();
    this.loadUsers();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      cause: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  loadCauses() {
    // Load causes to populate the ng-select dropdown
    this.mockApi.getCharities(1, 1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.causesList = res.data;
      this.cdr.markForCheck();
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    // filterCause can be null if ng-select is cleared, so fallback to 'All'
    const causeToSend = this.filterCause ? this.filterCause : 'All';
    
    this.mockApi.getUsers(this.page, this.limit, this.searchQuery, this.filterStatus, causeToSend)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.users = res.data;
        this.total = res.pagination.total;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load users', 'error');
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
    this.loadUsers();
  }

  resetSearch() {
    this.searchQuery = '';
    this.filterCause = null;
    this.filterStatus = 'All';
    this.page = 1;
    this.loadUsers();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadUsers();
  }

  onLimitChange() {
    this.page = 1; // Reset to first page
    this.loadUsers();
  }

  onFilterChange() {
    this.page = 1;
    this.loadUsers();
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.currentUserId = null;
    this.submitted = false;
    this.userForm.reset({ status: 'Active' });
    this.userForm.enable();
    this.isModalOpen = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.currentUserId = user.id;
    this.submitted = false;
    this.userForm.patchValue(user);
    this.userForm.enable();
    this.isModalOpen = true;
  }

  viewUser(user: any) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.currentUserId = user.id;
    this.submitted = false;
    this.userForm.patchValue(user);
    this.userForm.disable();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.getRawValue();
    if (this.isEditMode && this.currentUserId) {
      this.mockApi.updateUser(this.currentUserId, userData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message, 'success');
          this.loadUsers();
          this.closeModal();
        }
      });
    } else {
      this.mockApi.addUser(userData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message, 'success');
          this.loadUsers();
          this.closeModal();
        }
      });
    }
  }

  toggleStatus(user: any) {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const updatedUser = { ...user, status: newStatus };
    this.mockApi.updateUser(user.id, updatedUser).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(`User status changed to ${newStatus}`, 'success');
        this.loadUsers();
      }
    });
  }
}
