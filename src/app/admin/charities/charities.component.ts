import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-charities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./charities.component.scss'],
  templateUrl: './charities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharitiesComponent implements OnInit {
  charities: any[] = [];
  isLoading = true;
  
  // Modal state
  isModalOpen = false;
  isEditMode = false;
  isViewMode = false;
  currentId: number | null = null;
  
  charityForm!: FormGroup;
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
    this.loadCharities();
  }

  initForm() {
    this.charityForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      status: ['Active', Validators.required]
    });
  }

  loadCharities() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.mockApi.getCharities().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.charities = res.data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load charities', 'error');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.currentId = null;
    this.submitted = false;
    this.charityForm.reset({ status: 'Active' });
    this.charityForm.enable();
    this.isModalOpen = true;
  }

  openEditModal(item: any) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.currentId = item.id;
    this.submitted = false;
    this.charityForm.patchValue(item);
    this.charityForm.enable();
    this.isModalOpen = true;
  }

  viewCharity(item: any) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.currentId = item.id;
    this.submitted = false;
    this.charityForm.patchValue(item);
    this.charityForm.disable(); // Disable the form for view mode
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.charityForm.invalid) {
      return;
    }

    const data = this.charityForm.getRawValue();
    if (this.isEditMode && this.currentId) {
      this.mockApi.updateCharity(this.currentId, data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message, 'success');
          this.loadCharities();
          this.closeModal();
        }
      });
    } else {
      this.mockApi.addCharity(data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message, 'success');
          this.loadCharities();
          this.closeModal();
        }
      });
    }
  }

  toggleStatus(item: any) {
    const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    const updatedData = { ...item, status: newStatus };
    this.mockApi.updateCharity(item.id, updatedData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(`Cause status changed to ${newStatus}`, 'success');
        this.loadCharities();
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.charityForm.patchValue({ imageUrl: e.target.result });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}
