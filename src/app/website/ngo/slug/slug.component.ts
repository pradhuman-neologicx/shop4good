import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Ngo, MOCK_NGOS } from '../ngo-mock-data';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  selector: 'app-slug',
  styleUrl: './slug.component.scss',
  templateUrl: './slug.component.html',
})
export class SlugComponent implements OnInit {
  ngo: Ngo | undefined;
  showMarketplaceOptions: boolean = false;

  constructor(private route: ActivatedRoute) {}

  toggleMarketplaceOptions() {
    this.showMarketplaceOptions = !this.showMarketplaceOptions;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.ngo = MOCK_NGOS.find(n => n.slug === slug);
      }
    });
  }
}
