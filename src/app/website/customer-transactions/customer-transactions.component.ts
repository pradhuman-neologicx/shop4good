import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent],
  selector: 'app-customer-transactions',
  styleUrl: './customer-transactions.component.scss',
  templateUrl: './customer-transactions.component.html',
})
export class CustomerTransactionsComponent {
  Math = Math;
  
  transactions = [
    {
      id: 'TRX-98237',
      date: '15 Mar 2024',
      productName: 'Eco-Friendly Bamboo Toothbrush Set',
      totalAmount: 499,
      donatedAmount: 50,
      cause: 'Clean Oceans Initiative',
      status: 'Completed'
    },
    {
      id: 'TRX-98210',
      date: '02 Mar 2024',
      productName: 'Organic Cotton Tote Bag',
      totalAmount: 299,
      donatedAmount: 30,
      cause: 'Girl Child Education',
      status: 'Completed'
    },
    {
      id: 'TRX-97554',
      date: '18 Feb 2024',
      productName: 'Recycled Paper Notebook Bundle',
      totalAmount: 750,
      donatedAmount: 150,
      cause: 'Save The Trees Foundation',
      status: 'Pending'
    },
    {
      id: 'TRX-97102',
      date: '25 Jan 2024',
      productName: 'Solar Powered Lantern',
      totalAmount: 1200,
      donatedAmount: 200,
      cause: 'Rural Electrification',
      status: 'Completed'
    },
    {
      id: 'TRX-96401',
      date: '10 Jan 2024',
      productName: 'Reusable Coffee Cup',
      totalAmount: 599,
      donatedAmount: 60,
      cause: 'Forest Conservation',
      status: 'Cancelled'
    },
    {
      id: 'TRX-95882',
      date: '05 Jan 2024',
      productName: 'Biodegradable Phone Case',
      totalAmount: 899,
      donatedAmount: 90,
      cause: 'Wildlife Protection',
      status: 'Completed'
    }
  ];

  showFilters = false;
  
  // Filter States
  searchQuery = '';
  activeSearchQuery = '';
  statusFilter = 'All';
  dateFilter = 'All';
  causeFilter = 'All';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 4;

  get uniqueCauses() {
    return Array.from(new Set(this.transactions.map(t => t.cause)));
  }

  get filteredTransactions() {
    let list = this.transactions;
    
    // 1. Status Filter
    if (this.statusFilter !== 'All') {
      list = list.filter(t => t.status === this.statusFilter);
    }
    
    // 2. Cause Filter
    if (this.causeFilter !== 'All') {
      list = list.filter(t => t.cause === this.causeFilter);
    }
    
    // 3. Date Range Filter
    if (this.dateFilter !== 'All') {
      const now = new Date('2024-03-30'); // Using a fixed 'now' for consistent mock data filtering
      const cutoff = new Date(now);
      if (this.dateFilter === 'Last 30 Days') cutoff.setDate(cutoff.getDate() - 30);
      else if (this.dateFilter === 'Last 6 Months') cutoff.setMonth(cutoff.getMonth() - 6);
      else if (this.dateFilter === 'Last Year') cutoff.setFullYear(cutoff.getFullYear() - 1);
      
      list = list.filter(t => new Date(t.date) >= cutoff);
    }
    
    // 4. Search Filter
    if (this.activeSearchQuery.trim() !== '') {
      const q = this.activeSearchQuery.toLowerCase();
      list = list.filter(t => 
        t.productName.toLowerCase().includes(q) || 
        t.id.toLowerCase().includes(q) ||
        t.cause.toLowerCase().includes(q)
      );
    }
    
    return list;
  }

  get paginatedTransactions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage) || 1;
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  triggerSearch() {
    this.activeSearchQuery = this.searchQuery;
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchQuery = '';
    this.activeSearchQuery = '';
    this.statusFilter = 'All';
    this.dateFilter = 'All';
    this.causeFilter = 'All';
    this.currentPage = 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
