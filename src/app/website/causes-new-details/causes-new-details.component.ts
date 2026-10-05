import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { MarketplaceModalComponent, Marketplace } from '../components/marketplace-modal/marketplace-modal.component';

@Component({
  selector: 'app-causes-new-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, MarketplaceModalComponent, NgOptimizedImage],
  templateUrl: './causes-new-details.component.html',
  styleUrl: './causes-new-details.component.scss'
})
export class CausesNewDetailsComponent implements OnInit {
  ngo: any | undefined;
  isLoading: boolean = true;
  
  isMarketplaceOpen = false;
  marketplaces: Marketplace[] = [];
  causeDetail: any = null;
  selectedImageIndex = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMockData(id);
      }
    });
  }

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  loadMockData(id: string) {
    const mockItems: any = {
      'kids': {
        id: 'kids',
        name: 'Kids Education Support',
        slug: 'kids-education',
        cover_image_url: 'assets/images/Kids card photo.jpg',
        images: ['assets/images/Kids card photo.jpg'],
        description: '<p>Education is a fundamental human right, yet millions of children around the world are deprived of it. Our mission is to provide quality education to underprivileged children, equipping them with the knowledge and skills they need to break the cycle of poverty.</p><ul><li>Providing school supplies and uniforms</li><li>Funding scholarships for higher education</li><li>Building and renovating school facilities</li></ul><p>Your support can make a lasting impact on these young lives.</p>',
        short_description: 'Brighter minds for a brighter tomorrow. Help us provide quality education to underprivileged children.',
        goal_amount: 500000,
        raised_amount: 125000,
        donors_count: 245,
        is_active: true,
        is_featured: true,
        starts_at: '2026-01-01T00:00:00Z',
        ends_at: '2026-12-31T23:59:59Z',
        tags: ['Education', 'Children', 'Future']
      },
      'women': {
        id: 'women',
        name: 'Women Empowerment',
        slug: 'women-empowerment',
        cover_image_url: 'assets/images/Women card image.jpg',
        images: ['assets/images/Women card image.jpg'],
        description: '<p>Empowering women is key to building stronger, more resilient communities. We provide skill development, financial literacy, and livelihood opportunities to women in rural and urban areas.</p><ul><li>Vocational training programs</li><li>Microfinance support</li><li>Health and hygiene awareness</li></ul><p>Join us in creating a world where every woman has the opportunity to thrive.</p>',
        short_description: 'Stronger Women Build Stronger Communities. Support women in gaining independence and skills.',
        goal_amount: 300000,
        raised_amount: 85000,
        donors_count: 180,
        is_active: true,
        is_featured: true,
        starts_at: '2026-02-15T00:00:00Z',
        ends_at: '2026-11-30T23:59:59Z',
        tags: ['Women', 'Empowerment', 'Community']
      },
      'senior': {
        id: 'senior',
        name: 'Senior Citizen Care',
        slug: 'senior-citizen-care',
        cover_image_url: 'assets/images/Senior Citizen Card Image.jpg',
        images: ['assets/images/Senior Citizen Card Image.jpg'],
        description: '<p>Our elderly population deserves care, dignity, and respect in their golden years. We provide shelter, medical care, and emotional support to abandoned and destitute senior citizens.</p><ul><li>Safe shelter and nutritious meals</li><li>Regular medical check-ups and care</li><li>Recreational activities for mental well-being</li></ul><p>Help us ensure no senior citizen is left to fend for themselves.</p>',
        short_description: 'Respect, care and a more dignified tomorrow for our elders.',
        goal_amount: 800000,
        raised_amount: 320000,
        donors_count: 412,
        is_active: true,
        is_featured: true,
        starts_at: '2026-03-01T00:00:00Z',
        ends_at: '2026-12-31T23:59:59Z',
        tags: ['Seniors', 'Healthcare', 'Shelter']
      },
      'pets': {
        id: 'pets',
        name: 'Pet Care',
        slug: 'pet-care',
        cover_image_url: 'assets/images/Dog Card photo.jpg',
        images: ['assets/images/Dog Card photo.jpg'],
        description: '<p>Countless stray animals suffer on the streets every day. We are dedicated to rescuing, treating, and rehabilitating injured and abandoned animals.</p><ul><li>Emergency rescue operations</li><li>Veterinary care and vaccinations</li><li>Adoption drives and shelters</li></ul><p>Your contribution helps us give these innocent lives a second chance.</p>',
        short_description: 'Better care for happier companions. Support our animal rescue and rehabilitation efforts.',
        goal_amount: 200000,
        raised_amount: 95000,
        donors_count: 310,
        is_active: true,
        is_featured: true,
        starts_at: '2026-01-10T00:00:00Z',
        ends_at: '2026-10-31T23:59:59Z',
        tags: ['Animals', 'Rescue', 'Care']
      }
    };

    const mockItem = mockItems[id] || mockItems['kids']; // Fallback to kids if not found

    this.causeDetail = {
      name: mockItem.name,
      description: mockItem.description,
      shortDescription: mockItem.short_description,
      coverImage: mockItem.cover_image_url,
      goal_amount: mockItem.goal_amount,
      raised_amount: mockItem.raised_amount,
      donors_count: mockItem.donors_count,
      is_active: mockItem.is_active,
      is_featured: mockItem.is_featured,
      starts_at: mockItem.starts_at,
      ends_at: mockItem.ends_at,
      images: mockItem.images
    };
    
    this.ngo = {
      id: mockItem.id,
      name: mockItem.name,
      slug: mockItem.slug,
      coverImage: mockItem.cover_image_url,
      logo: 'https://images.unsplash.com/photo-1531206715517-5c0bf140bd33?q=80',
      causes: mockItem.tags,
      shortDescription: mockItem.short_description,
      longDescription: mockItem.description,
      causeDetail: this.causeDetail
    };

    this.isLoading = false;
  }
}
