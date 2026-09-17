import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-reconciliation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  styleUrls: ['./reconciliation.component.scss'],
  templateUrl: './reconciliation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReconciliationComponent implements OnInit {
  unmatchedTransactions: any[] = [];
  usersList: any[] = [];
  isLoading = true;
  
  // Pagination & Filters
  page = 1;
  limit = 10;
  total = 0;
  searchQuery = '';
  startDate = '';
  endDate = '';

  // Modal state
  isModalOpen = false;
  selectedTransaction: any = null;
  
  matchForm!: FormGroup;
  submitted = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private mockApi: AdminMockApiService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.matchForm = this.fb.group({
      userId: ['', Validators.required]
    });
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    // Load unmatched transactions and users simultaneously for the dropdown
    this.mockApi.getUnmatchedTransactions(this.page, this.limit, this.searchQuery, this.startDate, this.endDate)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.unmatchedTransactions = res.data;
      this.total = res.pagination.total;
      this.cdr.markForCheck();
      
      this.mockApi.getUsers(1, 1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(usersRes => {
        this.usersList = usersRes.data;
        this.isLoading = false;
        this.cdr.markForCheck();
      });
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadData();
  }

  onLimitChange() {
    this.page = 1;
    this.loadData();
  }

  onFilterChange() {
    this.page = 1;
    this.loadData();
  }

  get showingFrom() {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get showingTo() {
    return Math.min(this.page * this.limit, this.total);
  }

  onSearch() {
    this.page = 1;
    this.loadData();
  }

  resetSearch() {
    this.searchQuery = '';
    this.page = 1;
    this.loadData();
  }

  openMatchModal(transaction: any) {
    this.selectedTransaction = transaction;
    this.submitted = false;
    this.matchForm.reset();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTransaction = null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.matchForm.invalid || !this.selectedTransaction) {
      return;
    }

    const userId = this.matchForm.value.userId;
    
    this.mockApi.reconcileTransaction(this.selectedTransaction.id, userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.notification.show(res.message, 'success');
        this.loadData();
        this.closeModal();
        this.cdr.markForCheck();
      }
    });
  }
}
