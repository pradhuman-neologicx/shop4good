import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  styleUrls: ['./donations.component.scss'],
  templateUrl: './donations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonationsComponent implements OnInit {
  donations: any[] = [];
  isLoading = true;

  // Pagination & Filters
  page = 1;
  limit = 10;
  total = 0;
  searchQuery = '';
  filterStatus = 'All';
  startDate = '';
  endDate = '';

  private destroyRef = inject(DestroyRef);

  constructor(
    private mockApi: AdminMockApiService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDonations();
  }

  loadDonations() {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.mockApi.getDonations(this.page, this.limit, this.searchQuery, this.filterStatus, this.startDate, this.endDate)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.donations = res.data;
        this.total = res.pagination.total;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notification.show('Failed to load donations', 'error');
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
    this.loadDonations();
  }

  resetSearch() {
    this.searchQuery = '';
    this.page = 1;
    this.loadDonations();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadDonations();
  }

  onLimitChange() {
    this.page = 1; // Reset to first page
    this.loadDonations();
  }

  onFilterChange() {
    this.page = 1;
    this.loadDonations();
  }
}
