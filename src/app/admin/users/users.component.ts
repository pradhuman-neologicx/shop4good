import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./users.component.scss'],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  
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
    this.loadUsers();
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      cause: [''],
      status: ['Active', Validators.required]
    });
  }

  loadUsers() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.mockApi.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.users = res.data;
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
