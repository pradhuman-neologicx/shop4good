import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { AdminUsermanagementService } from 'src/app/core/services/admin-usermanagement.service';
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
  isLoading = true;
  
  // Pagination & Filters
  page = 1;
  limit = 10;
  total = 0;
  searchQuery = '';

  // Modal state
  isModalOpen = false;
  isEditMode = false;
  isViewMode = false;
  currentUserId: number | null = null;
  selectedUser: any = null;
  
  userForm!: FormGroup;
  submitted = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private adminUserService: AdminUsermanagementService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      is_active: [true, Validators.required]
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    let params: any = {
      page: this.page,
      per_page: this.limit
    };
    
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    
    this.adminUserService.getUsers(params)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.users = res.data?.items || [];
        this.total = res.data?.meta?.total || 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notification.show('Failed to load users', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
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

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.currentUserId = null;
    this.submitted = false;
    this.userForm.reset({ is_active: true });
    this.userForm.enable();
    this.isModalOpen = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.currentUserId = user.id;
    this.selectedUser = user;
    this.submitted = false;
    this.userForm.patchValue(user);
    this.userForm.enable();
    this.isModalOpen = true;
  }

  viewUser(user: any) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.currentUserId = user.id;
    this.selectedUser = user;
    this.submitted = false;
    this.userForm.patchValue(user);
    this.userForm.disable();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.getRawValue();
    if (this.isEditMode && this.currentUserId) {
      this.adminUserService.updateUser(this.currentUserId, userData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message || 'User updated successfully', 'success');
          this.loadUsers();
          this.closeModal();
        }
      });
    } else {
      this.adminUserService.addUser(userData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message || 'User added successfully', 'success');
          this.loadUsers();
          this.closeModal();
        }
      });
    }
  }

  toggleStatus(user: any) {
    const newStatus = !user.is_active;
    const updatedUser = { ...user, is_active: newStatus };
    this.adminUserService.toggleUserStatus(user.id, { is_active: newStatus ? 1 : 0 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(res.message || `User status changed`, 'success');
        this.loadUsers();
      },
      error: () => {
        // this.notification.show('Failed to change status', 'error');
      }
    });
  }
}
