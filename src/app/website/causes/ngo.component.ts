import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ngo, MOCK_NGOS } from './ngo-mock-data';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  selector: 'app-ngo',
  styleUrl: './ngo.component.scss',
  templateUrl: './ngo.component.html',
})
export class NgoComponent implements OnInit {
  allNgos = MOCK_NGOS;
  filteredNgos: Ngo[] = [];
  
  // Filters
  searchQuery: string = '';
  selectedCauses: string[] = [];
  
  // Available causes for filter
  availableCauses: string[] = [];

  ngOnInit() {
    this.filteredNgos = [...this.allNgos];
    this.extractCauses();
  }

  extractCauses() {
    const causesSet = new Set<string>();
    this.allNgos.forEach(ngo => {
      ngo.causes.forEach(cause => causesSet.add(cause));
    });
    this.availableCauses = Array.from(causesSet).sort();
  }

  toggleCause(cause: string) {
    const index = this.selectedCauses.indexOf(cause);
    if (index > -1) {
      this.selectedCauses.splice(index, 1);
    } else {
      this.selectedCauses.push(cause);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredNgos = this.allNgos.filter(ngo => {
      // Check search query
      const matchesSearch = this.searchQuery === '' || 
        ngo.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ngo.shortDescription.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        ngo.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Check causes
      const matchesCauses = this.selectedCauses.length === 0 || 
        this.selectedCauses.some(selectedCause => ngo.causes.includes(selectedCause));

      return matchesSearch && matchesCauses;
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCauses = [];
    this.applyFilters();
  }
}
