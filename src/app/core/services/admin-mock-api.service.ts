import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminMockApiService {
  
  // Cache subjects
  private usersSubject = new BehaviorSubject<any[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', mobile: '+1234567890', cause: 'Save the Oceans', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '+0987654321', cause: 'Education for All', status: 'Active' },
    { id: 3, name: 'Mike Ross', email: 'mike.ross@example.com', mobile: '+1122334455', cause: 'Animal Shelter', status: 'Inactive' },
    { id: 4, name: 'Sarah Connor', email: 'sarah.c@example.com', mobile: '+1987654321', cause: 'Save the Oceans', status: 'Active' },
    { id: 5, name: 'Tom Hanks', email: 'tom.h@example.com', mobile: '+1122334466', cause: 'Education for All', status: 'Active' },
    { id: 6, name: 'Bruce Wayne', email: 'bruce.w@example.com', mobile: '+9988776655', cause: 'Gotham Relief', status: 'Inactive' }
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

  constructor() { }

  private paginateData(data: any[], page: number, limit: number) {
    const total = data.length;
    const last_page = Math.ceil(total / limit) || 1;
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    const paginatedData = data.slice(from - 1, to);

    return {
      data: paginatedData,
      pagination: {
        current_page: page,
        last_page,
        per_page: limit.toString(),
        total,
        from: total === 0 ? 0 : from,
        to: total === 0 ? 0 : to
      }
    };
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
    return of({ status: 200, data: stats }).pipe(delay(300));
  }

  // -----------------------------------------------------
  // 2. USERS MOCK APIS
  // -----------------------------------------------------
  getUsers(page = 1, limit = 10, search = '', status = 'All', cause = 'All'): Observable<any> {
    let data = this.usersSubject.value;
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(u => u.name.toLowerCase().includes(lowerSearch) || u.email.toLowerCase().includes(lowerSearch));
    }
    if (status && status !== 'All') {
      data = data.filter(u => u.status === status);
    }
    if (cause && cause !== 'All') {
      data = data.filter(u => u.cause === cause);
    }
    
    const result = this.paginateData(data, page, limit);
    return of({ status: 200, message: 'Users fetched successfully', ...result }).pipe(delay(300));
  }

  addUser(user: any): Observable<any> {
    const newUser = { id: Math.floor(Math.random() * 100), ...user };
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, newUser]);
    return of({ status: 200, message: 'User added successfully', data: newUser }).pipe(delay(300));
  }

  updateUser(id: number, user: any): Observable<any> {
    const current = this.usersSubject.value;
    const index = current.findIndex(u => u.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...user };
      this.usersSubject.next([...current]);
    }
    return of({ status: 200, message: 'User updated successfully', data: { id, ...user } }).pipe(delay(300));
  }

  deleteUser(id: number): Observable<any> {
    const current = this.usersSubject.value;
    this.usersSubject.next(current.filter(u => u.id !== id));
    return of({ status: 200, message: 'User deleted successfully' }).pipe(delay(300));
  }

  // -----------------------------------------------------
  // 3. CHARITIES / CAUSES MOCK APIS
  // -----------------------------------------------------
  getCharities(page = 1, limit = 10, search = '', status = 'All'): Observable<any> {
    let data = this.charitiesSubject.value;

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(c => c.name.toLowerCase().includes(lowerSearch));
    }
    if (status && status !== 'All') {
      data = data.filter(c => c.status === status);
    }

    const result = this.paginateData(data, page, limit);
    return of({ status: 200, message: 'Charities fetched successfully', ...result }).pipe(delay(300));
  }

  addCharity(charity: any): Observable<any> {
    const newCharity = { id: Math.floor(Math.random() * 100), ...charity };
    const current = this.charitiesSubject.value;
    this.charitiesSubject.next([...current, newCharity]);
    return of({ status: 200, message: 'Charity added successfully', data: newCharity }).pipe(delay(300));
  }

  updateCharity(id: number, charity: any): Observable<any> {
    const current = this.charitiesSubject.value;
    const index = current.findIndex(c => c.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...charity };
      this.charitiesSubject.next([...current]);
    }
    return of({ status: 200, message: 'Charity updated successfully', data: { id, ...charity } }).pipe(delay(300));
  }

  deleteCharity(id: number): Observable<any> {
    const current = this.charitiesSubject.value;
    this.charitiesSubject.next(current.filter(c => c.id !== id));
    return of({ status: 200, message: 'Charity deleted successfully' }).pipe(delay(300));
  }

  // -----------------------------------------------------
  // 4. MARKETPLACES MOCK APIS
  // -----------------------------------------------------
  getMarketplaces(page = 1, limit = 10, search = '', status = 'All'): Observable<any> {
    let data = this.marketplacesSubject.value;

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(m => m.name.toLowerCase().includes(lowerSearch));
    }
    if (status && status !== 'All') {
      data = data.filter(m => m.status === status);
    }

    const result = this.paginateData(data, page, limit);
    return of({ status: 200, message: 'Marketplaces fetched successfully', ...result }).pipe(delay(300));
  }

  addMarketplace(marketplace: any): Observable<any> {
    const newMarket = { id: Math.floor(Math.random() * 100), ...marketplace };
    const current = this.marketplacesSubject.value;
    this.marketplacesSubject.next([...current, newMarket]);
    return of({ status: 200, message: 'Marketplace added successfully', data: newMarket }).pipe(delay(300));
  }

  updateMarketplace(id: number, marketplace: any): Observable<any> {
    const current = this.marketplacesSubject.value;
    const index = current.findIndex(m => m.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...marketplace };
      this.marketplacesSubject.next([...current]);
    }
    return of({ status: 200, message: 'Marketplace updated successfully', data: { id, ...marketplace } }).pipe(delay(300));
  }

  deleteMarketplace(id: number): Observable<any> {
    const current = this.marketplacesSubject.value;
    this.marketplacesSubject.next(current.filter(m => m.id !== id));
    return of({ status: 200, message: 'Marketplace deleted successfully' }).pipe(delay(300));
  }

  // -----------------------------------------------------
  // 5. DONATIONS & TRANSACTIONS MOCK APIS
  // -----------------------------------------------------
  getDonations(page = 1, limit = 10, search = '', status = 'All', startDate = '', endDate = ''): Observable<any> {
    let data = [
      { id: 1001, transactionId: 'TXN-AMZ-991', marketplace: 'Amazon', amount: 150.00, donationAmount: 3.00, user: 'john.doe@example.com', cause: 'Save the Oceans', status: 'Matched', date: '2023-10-01' },
      { id: 1002, transactionId: 'TXN-WAL-442', marketplace: 'Walmart', amount: 200.00, donationAmount: 7.00, user: 'jane.smith@example.com', cause: 'Education for All', status: 'Matched', date: '2023-10-02' },
      { id: 1003, transactionId: 'TXN-AMZ-881', marketplace: 'Amazon', amount: 50.00, donationAmount: 1.00, user: 'Unknown (unmatched@example.com)', cause: 'Pending', status: 'Unmatched', date: '2023-10-03' },
      { id: 1004, transactionId: 'TXN-AMZ-912', marketplace: 'Amazon', amount: 120.00, donationAmount: 2.40, user: 'Unknown (unmatched@example.com)', cause: 'Pending', status: 'Unmatched', date: '2023-10-04' },
      { id: 1005, transactionId: 'TXN-WAL-553', marketplace: 'Walmart', amount: 300.00, donationAmount: 10.50, user: 'sarah.c@example.com', cause: 'Save the Oceans', status: 'Matched', date: '2023-10-05' }
    ];

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(d => d.transactionId.toLowerCase().includes(lowerSearch) || d.user.toLowerCase().includes(lowerSearch));
    }
    if (status && status !== 'All') {
      data = data.filter(d => d.status === status);
    }
    if (startDate) {
      data = data.filter(d => new Date(d.date) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter(d => new Date(d.date) <= new Date(endDate));
    }

    const result = this.paginateData(data, page, limit);
    return of({ status: 200, message: 'Donations fetched successfully', ...result }).pipe(delay(300));
  }

  // -----------------------------------------------------
  // 6. RECONCILIATION MOCK APIS
  // -----------------------------------------------------
  getUnmatchedTransactions(page = 1, limit = 10, search = '', startDate = '', endDate = ''): Observable<any> {
    let data = [
      { id: 1003, transactionId: 'TXN-AMZ-881', marketplace: 'Amazon', amount: 50.00, donationAmount: 1.00, reportedEmail: 'unmatched@example.com', date: '2023-10-03' },
      { id: 1004, transactionId: 'TXN-AMZ-912', marketplace: 'Amazon', amount: 120.00, donationAmount: 2.40, reportedEmail: 'missing_user@test.com', date: '2023-10-04' },
      { id: 1006, transactionId: 'TXN-WAL-776', marketplace: 'Walmart', amount: 45.00, donationAmount: 1.50, reportedEmail: 'wrong_email@test.com', date: '2023-10-06' }
    ];

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(d => d.transactionId.toLowerCase().includes(lowerSearch) || d.reportedEmail.toLowerCase().includes(lowerSearch));
    }
    if (startDate) {
      data = data.filter(d => new Date(d.date) >= new Date(startDate));
    }
    if (endDate) {
      data = data.filter(d => new Date(d.date) <= new Date(endDate));
    }

    const result = this.paginateData(data, page, limit);
    return of({ status: 200, message: 'Unmatched transactions fetched successfully', ...result }).pipe(delay(300));
  }

  reconcileTransaction(transactionId: number, userId: number): Observable<any> {
    return of({ status: 200, message: 'Transaction reconciled successfully' }).pipe(delay(300));
  }

}

