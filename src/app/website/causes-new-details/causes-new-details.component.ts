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
        description: `<h2><strong>Empower Every Child Through Education</strong></h2><p>Every child deserves the opportunity to learn, grow, and build a brighter future. Unfortunately, many underprivileged children lack access to quality education, essential school supplies, and the learning resources they need to succeed.</p><h3><strong>Our Mission</strong></h3><p>The Kids Education Support initiative aims to make education accessible to children from underserved communities by providing essential educational resources and opportunities.</p><h3><strong>How Your Donation Helps</strong></h3><ul><li><strong>School Supplies:</strong> Provide books, notebooks, stationery, and other essential learning materials.</li><li><strong>Quality Education:</strong> Support access to educational resources and learning programs.</li><li><strong>Better Opportunities:</strong> Help children develop essential skills and pursue their dreams.</li><li><strong>Brighter Futures:</strong> Empower children to build a better future for themselves and their communities.</li></ul><h3><strong>Make a Difference Today</strong></h3><p>Every contribution, big or small, can help create meaningful opportunities for children in need. Join us in making education accessible to every child and building a future filled with hope, knowledge, and possibilities.</p><p><strong>Together, we can turn dreams into reality — one child, one opportunity, and one brighter future at a time.</strong></p>`,
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
        description: `<p>Women empowerment is about creating a world where every woman has the opportunity to live independently, make her own decisions, and achieve her dreams. Many women face challenges such as limited access to education, financial resources, employment, and equal opportunities. This initiative aims to reduce these barriers and help women build a better future for themselves and their families.</p><h3><strong>Our Mission</strong></h3><p>Our mission is to empower women by providing opportunities for education, skill development, financial independence, and entrepreneurship. We aim to help women gain confidence, develop their abilities, and participate equally in society.</p><h3><strong>How We Make a Difference</strong></h3><ul><li><strong>Education and Skill Development:</strong> Supporting women through educational opportunities, vocational training, and professional skill development.</li><li><strong>Financial Independence:</strong> Helping women access employment opportunities and develop the skills needed to earn a stable income.</li><li><strong>Women Entrepreneurship:</strong> Encouraging women to start small businesses, develop business ideas, and become self-reliant.</li><li><strong>Equal Opportunities:</strong> Promoting equal access to education, employment, leadership, and community participation.</li><li><strong>Community Support:</strong> Helping women from underserved communities improve their living conditions and create better opportunities for their families.</li></ul><h3><strong>Why Women Empowerment Matters</strong></h3><p>When women have access to education, resources, and opportunities, the benefits extend beyond individuals to families and entire communities. Empowered women can contribute to economic growth, improve family well-being, and inspire future generations to pursue their goals.</p><h3><strong>Make a Difference with Shop4Good</strong></h3><p>Through Shop4Good, you can support the cause of women empowerment while shopping online through participating marketplaces. Your eligible shopping activity can help generate affiliate revenue, a portion of which supports selected charitable causes, subject to the platform's applicable terms.</p><p><strong>Shop & donate today</strong> to help create opportunities for women, encourage independence, and build a more equal and inclusive future. Together, we can help every woman move towards a life of dignity, confidence, and financial security.</p>`,
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
        description: `<p>Every senior citizen deserves respect, love, care, and the opportunity to live a dignified life. As people grow older, they may face challenges such as loneliness, health concerns, financial difficulties, and limited access to essential services. Senior Citizen Care aims to support elderly individuals by promoting their well-being, safety, and quality of life.</p><h3><strong>Our Mission</strong></h3><p>Our mission is to ensure that senior citizens receive the care, attention, and support they need to live with dignity, comfort, and independence. We aim to create a caring environment where older adults feel valued, respected, and connected to their communities.</p><h3><strong>How We Make a Difference</strong></h3><ul><li><strong>Healthcare Support:</strong> Helping senior citizens access essential healthcare services, medical checkups, and necessary assistance.</li><li><strong>Food and Nutrition:</strong> Supporting access to nutritious meals and essential daily necessities.</li><li><strong>Emotional Well-being:</strong> Encouraging social interaction, companionship, and emotional support to reduce loneliness.</li><li><strong>Safe Living:</strong> Promoting safe and comfortable living conditions for elderly individuals in need.</li><li><strong>Community Care:</strong> Encouraging communities to participate in supporting and caring for senior citizens.</li></ul><h3><strong>Why Senior Citizen Care Matters</strong></h3><p>Older adults have contributed to their families and communities throughout their lives. Providing them with proper care and respect helps ensure that their later years are filled with comfort, security, and happiness. Even small acts of kindness and support can make a meaningful difference in their lives.</p><h3><strong>Make a Difference with Shop4Good</strong></h3><p>Through Shop4Good, you can support the Senior Citizen Care cause while shopping online through participating marketplaces. Eligible shopping activity can generate affiliate revenue, a portion of which supports selected charitable causes, subject to the platform's applicable terms.</p><p><strong>Shop & donate today</strong> to help provide care, comfort, and dignity to senior citizens. Together, we can build a society where every elderly person feels respected, supported, and valued.</p>`,
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
        description: `<p>Every animal deserves love, safety, proper care, and a chance to live a healthy and happy life. Many pets and stray animals face challenges such as hunger, illness, injuries, abandonment, and a lack of shelter. The Pet Care cause aims to improve their lives by supporting animal welfare, rescue, treatment, and rehabilitation.</p><h3><strong>Our Mission</strong></h3><p>Our mission is to promote animal welfare by helping vulnerable animals receive the care, protection, and attention they need. We aim to create a compassionate community where every animal is treated with kindness and respect.</p><h3><strong>How We Make a Difference</strong></h3><ul><li><strong>Animal Rescue:</strong> Supporting efforts to rescue abandoned, injured, and vulnerable animals.</li><li><strong>Food and Nutrition:</strong> Helping provide nutritious food and clean water for animals in need.</li><li><strong>Veterinary Care:</strong> Supporting medical treatment, vaccinations, and essential healthcare services.</li><li><strong>Shelter and Safety:</strong> Promoting safe shelters and comfortable living conditions for homeless animals.</li><li><strong>Adoption and Rehabilitation:</strong> Encouraging responsible pet adoption and helping rescued animals recover and find loving homes.</li></ul><h3><strong>Why Pet Care Matters</strong></h3><p>Animals play an important role in our lives and communities. Providing proper care helps prevent animal suffering, improves their health, and creates a safer environment for both animals and people. Small acts of kindness can make a meaningful difference in the lives of animals who cannot speak for themselves.</p><h3><strong>Make a Difference with Shop4Good</strong></h3><p>Through Shop4Good, you can support the Pet Care cause while shopping online through participating marketplaces. Eligible shopping activity can generate affiliate revenue, a portion of which supports selected charitable causes, subject to the platform's applicable terms.</p><p><strong>Shop & donate today</strong> to help animals receive food, shelter, medical care, and a second chance at life. Together, we can build a kinder world where every animal has the opportunity to live safely and happily.</p>`,
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
