import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./donations.component.scss'],
  templateUrl: './donations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DonationsComponent implements OnInit {
  donations: any[] = [];
  isLoading = true;

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
    this.mockApi.getDonations().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.donations = res.data;
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
}
