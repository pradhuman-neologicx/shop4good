import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminMockApiService } from 'src/app/core/services/admin-mock-api.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reconciliation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./reconciliation.component.scss'],
  templateUrl: './reconciliation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReconciliationComponent implements OnInit {
  unmatchedTransactions: any[] = [];
  usersList: any[] = [];
  isLoading = true;
  
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
    this.mockApi.getUnmatchedTransactions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.unmatchedTransactions = res.data;
      this.cdr.markForCheck();
      
      this.mockApi.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(usersRes => {
        this.usersList = usersRes.data;
        this.isLoading = false;
        this.cdr.markForCheck();
      });
    });
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
