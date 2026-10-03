import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CausesService } from 'src/app/core/services/causes.service';
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

  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;

  galleryImageFiles: File[] = [];
  galleryImagePreviews: string[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    private causesService: CausesService,
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
      short_description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      description: ['', Validators.required],
      tags: [''],
      is_featured: [false],
      starts_at: ['', Validators.required],
      ends_at: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startsAt = group.get('starts_at')?.value;
    const endsAt = group.get('ends_at')?.value;
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
    
    let params: any = {
      page: this.page,
      per_page: this.limit
    };
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    if (this.filterStatus !== 'All') {
      params.is_active = this.filterStatus === 'Active' ? 1 : 0;
    }

    this.causesService.getAdminCauses(params)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.charities = res.data?.items || [];
        this.total = res.data?.meta?.total || 0;
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
    this.page = 1;
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
    
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.galleryImageFiles = [];
    this.galleryImagePreviews = [];
    
    this.charityForm.reset({ is_featured: false });
    this.charityForm.enable();
    this.isModalOpen = true;
  }

  openEditModal(item: any) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.currentId = item.id;
    this.submitted = false;
    
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.galleryImageFiles = [];
    this.galleryImagePreviews = [];
    
    this.charityForm.reset({ is_featured: false });
    this.charityForm.enable();
    
    this.causesService.getAdminCauseById(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res.data;
        this.coverImagePreview = data.cover_image_url || null;
        this.galleryImagePreviews = data.images ? data.images.map((i:any) => typeof i === 'string' ? i : i.url) : [];
        
        this.charityForm.patchValue({
          name: data.name,
          short_description: data.short_description,
          description: data.description,
          tags: data.tags_string || (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) || '',
          is_featured: data.is_featured,
          starts_at: data.starts_at ? data.starts_at.split('T')[0] : '',
          ends_at: data.ends_at ? data.ends_at.split('T')[0] : ''
        });
        
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load charity details', 'error');
      }
    });
  }

  viewCharity(item: any) {
    this.isEditMode = false;
    this.isViewMode = true;
    this.currentId = item.id;
    this.submitted = false;
    
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.galleryImageFiles = [];
    this.galleryImagePreviews = [];
    
    this.charityForm.reset({ is_featured: false });
    this.charityForm.disable(); // Disable immediately
    
    this.causesService.getAdminCauseById(item.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res.data;
        this.coverImagePreview = data.cover_image_url || null;
        this.galleryImagePreviews = data.images ? data.images.map((i:any) => typeof i === 'string' ? i : i.url) : [];
        
        this.charityForm.patchValue({
          name: data.name,
          short_description: data.short_description,
          description: data.description,
          tags: data.tags_string || (Array.isArray(data.tags) ? data.tags.join(', ') : data.tags) || '',
          is_featured: data.is_featured,
          starts_at: data.starts_at ? data.starts_at.split('T')[0] : '',
          ends_at: data.ends_at ? data.ends_at.split('T')[0] : ''
        });
        
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load charity details', 'error');
      }
    });
  }

  get tagsArray(): string[] {
    const tagsVal = this.charityForm.get('tags')?.value;
    if (Array.isArray(tagsVal)) {
      return tagsVal;
    }
    if (typeof tagsVal === 'string' && tagsVal.trim()) {
      return tagsVal.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }
    return [];
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.charityForm.invalid) {
      return;
    }
    
    if (!this.isEditMode && !this.coverImageFile) {
       this.notification.show('Cover image is required', 'error');
       return;
    }

    const formValues = this.charityForm.getRawValue();
    const formData = new FormData();
    
    formData.append('name', formValues.name);
    formData.append('short_description', formValues.short_description);
    formData.append('description', formValues.description);
    if (formValues.tags) {
      formData.append('tags', formValues.tags);
    }
    formData.append('is_featured', formValues.is_featured ? '1' : '0');
    formData.append('starts_at', formValues.starts_at);
    formData.append('ends_at', formValues.ends_at);
    
    if (this.coverImageFile) {
      formData.append('cover_image', this.coverImageFile);
    }
    
    this.galleryImageFiles.forEach((file) => {
      formData.append('images[]', file);
    });
    if (this.isEditMode && this.currentId) {
      formData.append('_method', 'PUT');
      this.causesService.updateAdminCause(this.currentId, formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message || 'Cause updated successfully', 'success');
          this.loadCharities();
          this.closeModal();
        }
      });
    } else {
      this.causesService.addAdminCause(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.notification.show(res.message || 'Cause added successfully', 'success');
          this.loadCharities();
          this.closeModal();
        }
      });
    }
  }

  toggleStatus(item: any) {
    const newStatus = !item.is_active;
    const updatedData = { is_active: newStatus };
    this.causesService.toggleAdminCauseStatus(item.id, updatedData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(res.message || `Cause status changed to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
        this.loadCharities();
      }
    });
  }

  dragIndex: number | null = null;

  onFileSelected(event: any, field: string) {
    if (field === 'galleryImages') {
      const files = event.target.files;
      if (files && files.length > 0) {
        const remaining = 5 - this.galleryImageFiles.length;
        if (remaining <= 0) {
          this.notification.show('Maximum 5 gallery images allowed', 'error');
          event.target.value = null;
          return;
        }
        const filesToProcess = Array.from(files).slice(0, remaining) as File[];
        if (files.length > remaining) {
          this.notification.show(`Only ${remaining} more image(s) can be added (max 5)`, 'error');
        }
        
        filesToProcess.forEach((file: File) => {
          this.galleryImageFiles = [...this.galleryImageFiles, file];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.galleryImagePreviews = [...this.galleryImagePreviews, e.target.result];
            this.cdr.detectChanges();
          };
          reader.readAsDataURL(file);
        });
      }
    } else if (field === 'coverImage') {
      const file = event.target.files[0];
      if (file) {
        this.coverImageFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.coverImagePreview = e.target.result;
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Clear the input value so the same file can be selected again without issues
    event.target.value = null;
  }

  removeGalleryImage(index: number) {
    this.galleryImagePreviews.splice(index, 1);
    this.galleryImageFiles.splice(index, 1);
    this.cdr.detectChanges();
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
    
    const previews = [...this.galleryImagePreviews];
    const files = [...this.galleryImageFiles];
    
    const [movedPreview] = previews.splice(this.dragIndex, 1);
    previews.splice(dropIndex, 0, movedPreview);
    
    // Only move files if they exist (handling mixed existing urls and new files could be complex,
    // assuming they just clear and re-upload if they want to change order of new files for now)
    if (files.length === previews.length) {
      const [movedFile] = files.splice(this.dragIndex, 1);
      files.splice(dropIndex, 0, movedFile);
      this.galleryImageFiles = files;
    }
    
    this.galleryImagePreviews = previews;
    this.dragIndex = null;
    this.cdr.detectChanges();
  }

  onDragEnd() {
    this.dragIndex = null;
  }
}
