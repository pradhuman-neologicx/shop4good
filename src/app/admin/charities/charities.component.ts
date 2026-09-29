import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-charities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule, QuillModule],
  styleUrls: ['./charities.component.scss'],
  templateUrl: './charities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharitiesComponent implements OnInit {
  charities: any[] = [];
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
  
  charityForm!: FormGroup;
  submitted = false;
  todayDate = new Date().toISOString().split('T')[0];

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
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      tags: ['', Validators.required],
      longDescription: ['', Validators.required],
      logo: [''],
      coverImage: ['', Validators.required],
      status: ['Active', Validators.required],
      startsAt: ['', Validators.required],
      endsAt: ['', Validators.required],
      galleryImages: [[], Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startsAt = group.get('startsAt')?.value;
    const endsAt = group.get('endsAt')?.value;
    const errors: any = {};

    if (startsAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(startsAt) < today) {
        errors.startInPast = true;
      }
    }

    if (startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      errors.endBeforeStart = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  loadCharities() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.mockApi.getCharities(this.page, this.limit, this.searchQuery, this.filterStatus)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.charities = res.data;
        this.total = res.pagination.total;
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

  get showingFrom() {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get showingTo() {
    return Math.min(this.page * this.limit, this.total);
  }

  onSearch() {
    this.page = 1;
    this.loadCharities();
  }

  resetSearch() {
    this.searchQuery = '';
    this.page = 1;
    this.loadCharities();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadCharities();
  }

  onLimitChange() {
    this.page = 1; // Reset to first page
    this.loadCharities();
  }

  onFilterChange() {
    this.page = 1;
    this.loadCharities();
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

  dragIndex: number | null = null;

  onFileSelected(event: any, field: string) {
    if (field === 'galleryImages') {
      const files = event.target.files;
      if (files && files.length > 0) {
        const currentImages = this.charityForm.get('galleryImages')?.value || [];
        const remaining = 5 - currentImages.length;
        if (remaining <= 0) {
          this.notification.show('Maximum 5 gallery images allowed', 'error');
          return;
        }
        const filesToProcess = Array.from(files).slice(0, remaining);
        if (files.length > remaining) {
          this.notification.show(`Only ${remaining} more image(s) can be added (max 5)`, 'error');
        }
        filesToProcess.forEach((file: any) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            currentImages.push(e.target.result);
            this.charityForm.patchValue({ galleryImages: [...currentImages] });
            this.cdr.detectChanges();
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.charityForm.patchValue({ [field]: e.target.result });
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeGalleryImage(index: number) {
    const currentImages = this.charityForm.get('galleryImages')?.value || [];
    currentImages.splice(index, 1);
    this.charityForm.patchValue({ galleryImages: [...currentImages] });
  }

  onDragStart(index: number) {
    this.dragIndex = index;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === dropIndex) return;
    const images = [...(this.charityForm.get('galleryImages')?.value || [])];
    const [moved] = images.splice(this.dragIndex, 1);
    images.splice(dropIndex, 0, moved);
    this.charityForm.patchValue({ galleryImages: images });
    this.dragIndex = null;
    this.cdr.detectChanges();
  }

  onDragEnd() {
    this.dragIndex = null;
  }
}
