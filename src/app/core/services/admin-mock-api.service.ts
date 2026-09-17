import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class AdminMockApiService {
  
  // Cache subjects
  private usersSubject = new BehaviorSubject<any[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', mobile: '+1234567890', cause: 'Save the Oceans', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '+0987654321', cause: 'Education for All', status: 'Active' },
    { id: 3, name: 'Mike Ross', email: 'mike.ross@example.com', mobile: '+1122334455', cause: 'Animal Shelter', status: 'Inactive' }
  ]);
  
  private charitiesSubject = new BehaviorSubject<any[]>([
    { id: 1, name: 'Save the Oceans', description: 'Protecting marine life and cleaning oceans.', imageUrl: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=200&h=200&fit=crop', status: 'Active' },
    { id: 2, name: 'Education for All', description: 'Providing free education to underprivileged children.', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop', status: 'Active' },
    { id: 3, name: 'Animal Shelter', description: 'Rescue and rehabilitation for street animals.', imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop', status: 'Inactive' }
  ]);

  private marketplacesSubject = new BehaviorSubject<any[]>([
    { id: 1, name: 'Amazon', associateUrl: 'https://amazon.com', trackingParam: 'tag=shop4good-20', donationPercentage: 2.0, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', status: 'Active' },
    { id: 2, name: 'Walmart', associateUrl: 'https://walmart.com', trackingParam: 'aff=shop4good', donationPercentage: 3.5, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg', status: 'Active' }
  ]);

  constructor(private loader: LoaderService) { }

  private mockRequest<T>(data: T): Observable<T> {
    return new Observable<T>(observer => {
      this.loader.setLoading(true);
      setTimeout(() => {
        observer.next(data);
        observer.complete();
        this.loader.setLoading(false);
      }, 300);
    });
  }

  // -----------------------------------------------------
  // 1. DASHBOARD MOCK APIS
  // -----------------------------------------------------
  getDashboardStats(): Observable<any> {
    const stats = {
      totalUsers: this.usersSubject.value.length,
      totalDonations: 45000,
      totalMarketplaces: this.marketplacesSubject.value.length,
      activeCauses: this.charitiesSubject.value.filter(c => c.status === 'Active').length,
      recentDonations: [
        { id: 101, user: 'john.doe@example.com', amount: 5.50, cause: 'Save the Oceans', date: new Date().toISOString() },
        { id: 102, user: 'jane.smith@example.com', amount: 12.00, cause: 'Education for All', date: new Date().toISOString() },
        { id: 103, user: 'mike.ross@example.com', amount: 3.25, cause: 'Animal Shelter', date: new Date().toISOString() }
      ]
    };
    return this.mockRequest({ status: 200, data: stats });
  }

  // -----------------------------------------------------
  // 2. USERS MOCK APIS
  // -----------------------------------------------------
  getUsers(): Observable<any> {
    return this.mockRequest({ status: 200, data: this.usersSubject.value });
  }

  addUser(user: any): Observable<any> {
    const newUser = { id: Math.floor(Math.random() * 100), ...user };
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, newUser]);
    return this.mockRequest({ status: 200, message: 'User added successfully', data: newUser });
  }

  updateUser(id: number, user: any): Observable<any> {
    const current = this.usersSubject.value;
    const index = current.findIndex(u => u.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...user };
      this.usersSubject.next([...current]);
    }
    return this.mockRequest({ status: 200, message: 'User updated successfully', data: { id, ...user } });
  }

  deleteUser(id: number): Observable<any> {
    const current = this.usersSubject.value;
    this.usersSubject.next(current.filter(u => u.id !== id));
    return this.mockRequest({ status: 200, message: 'User deleted successfully' });
  }

  // -----------------------------------------------------
  // 3. CHARITIES / CAUSES MOCK APIS
  // -----------------------------------------------------
  getCharities(): Observable<any> {
    return this.mockRequest({ status: 200, data: this.charitiesSubject.value });
  }

  addCharity(charity: any): Observable<any> {
    const newCharity = { id: Math.floor(Math.random() * 100), ...charity };
    const current = this.charitiesSubject.value;
    this.charitiesSubject.next([...current, newCharity]);
    return this.mockRequest({ status: 200, message: 'Charity added successfully', data: newCharity });
  }

  updateCharity(id: number, charity: any): Observable<any> {
    const current = this.charitiesSubject.value;
    const index = current.findIndex(c => c.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...charity };
      this.charitiesSubject.next([...current]);
    }
    return this.mockRequest({ status: 200, message: 'Charity updated successfully', data: { id, ...charity } });
  }

  deleteCharity(id: number): Observable<any> {
    const current = this.charitiesSubject.value;
    this.charitiesSubject.next(current.filter(c => c.id !== id));
    return this.mockRequest({ status: 200, message: 'Charity deleted successfully' });
  }

  // -----------------------------------------------------
  // 4. MARKETPLACES MOCK APIS
  // -----------------------------------------------------
  getMarketplaces(): Observable<any> {
    return this.mockRequest({ status: 200, data: this.marketplacesSubject.value });
  }

  addMarketplace(marketplace: any): Observable<any> {
    const newMarket = { id: Math.floor(Math.random() * 100), ...marketplace };
    const current = this.marketplacesSubject.value;
    this.marketplacesSubject.next([...current, newMarket]);
    return this.mockRequest({ status: 200, message: 'Marketplace added successfully', data: newMarket });
  }

  updateMarketplace(id: number, marketplace: any): Observable<any> {
    const current = this.marketplacesSubject.value;
    const index = current.findIndex(m => m.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...marketplace };
      this.marketplacesSubject.next([...current]);
    }
    return this.mockRequest({ status: 200, message: 'Marketplace updated successfully', data: { id, ...marketplace } });
  }

  deleteMarketplace(id: number): Observable<any> {
    const current = this.marketplacesSubject.value;
    this.marketplacesSubject.next(current.filter(m => m.id !== id));
    return this.mockRequest({ status: 200, message: 'Marketplace deleted successfully' });
  }

  // -----------------------------------------------------
  // 5. DONATIONS & TRANSACTIONS MOCK APIS
  // -----------------------------------------------------
  getDonations(): Observable<any> {
    const donations = [
      { id: 1001, transactionId: 'TXN-AMZ-991', marketplace: 'Amazon', amount: 150.00, donationAmount: 3.00, user: 'john.doe@example.com', cause: 'Save the Oceans', status: 'Matched', date: '2023-10-01' },
      { id: 1002, transactionId: 'TXN-WAL-442', marketplace: 'Walmart', amount: 200.00, donationAmount: 7.00, user: 'jane.smith@example.com', cause: 'Education for All', status: 'Matched', date: '2023-10-02' },
      { id: 1003, transactionId: 'TXN-AMZ-881', marketplace: 'Amazon', amount: 50.00, donationAmount: 1.00, user: 'Unknown (unmatched@example.com)', cause: 'Pending', status: 'Unmatched', date: '2023-10-03' }
    ];
    return this.mockRequest({ status: 200, data: donations });
  }

  // -----------------------------------------------------
  // 6. RECONCILIATION MOCK APIS
  // -----------------------------------------------------
  getUnmatchedTransactions(): Observable<any> {
    const unmatched = [
      { id: 1003, transactionId: 'TXN-AMZ-881', marketplace: 'Amazon', amount: 50.00, donationAmount: 1.00, reportedEmail: 'unmatched@example.com', date: '2023-10-03' },
      { id: 1004, transactionId: 'TXN-AMZ-912', marketplace: 'Amazon', amount: 120.00, donationAmount: 2.40, reportedEmail: 'missing_user@test.com', date: '2023-10-04' }
    ];
    return this.mockRequest({ status: 200, data: unmatched });
  }

  reconcileTransaction(transactionId: number, userId: number): Observable<any> {
    return this.mockRequest({ status: 200, message: 'Transaction reconciled successfully' });
  }

}

