import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { MarketplaceModalComponent, Marketplace } from '../components/marketplace-modal/marketplace-modal.component';

export interface CauseStat {
  value: string;
  label: string;
  icon: string;
}

export interface HowWeHelpItem {
  title: string;
  desc?: string;
  icon: string;
}

export interface NgoPartner {
  name: string;
  description: string;
  logo: string;
  verified: boolean;
}

export interface ImpactStory {
  image: string;
  tag: string;
  quote: string;
}

export interface CauseItem {
  id: string;
  name: string;
  slug: string;
  badge: string;
  subtitle: string;
  cover_image_url: string;
  images: string[];
  stats: CauseStat[];
  howWeHelp: HowWeHelpItem[];
  partner: NgoPartner;
  impactStory: ImpactStory;
  description: string;
  goal_amount: number;
  raised_amount: number;
  donors_count: number;
  is_active: boolean;
  is_featured: boolean;
  starts_at: string;
  ends_at: string;
  tags: string[];
}

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
  currentId: string = 'pets';
  
  isMarketplaceOpen = false;
  marketplaces: Marketplace[] = [];
  causeDetail: CauseItem | any = null;
  selectedImageIndex = 0;

  copySuccess: boolean = false;
  private copyTimeout: any = null;

  otherCauses = [
    {
      id: 'kids',
      title: 'Kids Education',
      subtitle: 'Brighter minds for a brighter tomorrow',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#37426F'
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      subtitle: 'Stronger Women Build Stronger Communities',
      foundation: 'PraveenLata Sansthan Foundation',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#087F6A'
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      subtitle: 'Respect, care and a more dignified tomorrow.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#24272C'
    },
    {
      id: 'pets',
      title: 'Pet Care',
      subtitle: 'Better care for happier companions.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#7A263A'
    }
  ];

  get filteredOtherCauses() {
    return this.otherCauses.filter(c => c.id !== this.currentId);
  }

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentId = id;
        this.loadMockData(id);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    });
  }

  openMarketplace() {
    this.isMarketplaceOpen = true;
  }

  shareWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = this.causeDetail?.name || this.ngo?.name || 'Shop4Good';
    const text = `Support "${title}" on Shop4Good and help make a difference:\n${url}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  shareTwitter() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = this.causeDetail?.name || this.ngo?.name || 'Shop4Good';
    const text = `Support "${title}" on Shop4Good! Every contribution counts:`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  shareLinkedIn() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  copyLink() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (!url) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        this.triggerCopiedState();
      }).catch(() => {
        this.fallbackCopyText(url);
      });
    } else {
      this.fallbackCopyText(url);
    }
  }

  private triggerCopiedState() {
    this.copySuccess = true;
    this.cdr.detectChanges();
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    this.copyTimeout = setTimeout(() => {
      this.copySuccess = false;
      this.cdr.detectChanges();
    }, 2500);
  }

  private fallbackCopyText(text: string) {
    if (typeof document === 'undefined') return;
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        this.triggerCopiedState();
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }

  loadMockData(id: string) {
    const mockItems: Record<string, CauseItem> = {
      'pets': {
        id: 'pets',
        name: 'Pet Care',
        slug: 'pet-care',
        badge: 'Our cause',
        subtitle: 'Better care for happier companions.',
        cover_image_url: 'assets/images/banner-pets.png',
        images: ['assets/images/Dog Card photo.jpg'],
        stats: [
          { value: '3,100+', label: 'Animals supported', icon: 'paw' },
          { value: '20+', label: 'Shelters supported', icon: 'home' }
        ],
        howWeHelp: [
          { title: 'Rescue & rehabilitation', desc: 'Emergency rescue, hospitalisation and physical rehab for stray and abandoned animals.', icon: 'heart-cross' },
          { title: 'Better living conditions', desc: 'Clean kennels, compassionate handlers, hygienic beddings, and fresh meals.', icon: 'home' },
          { title: 'Animal welfare', desc: 'Vaccination drives, anti-rabies camps, legal advocacy, and loving adoption campaigns.', icon: 'shield-check' }
        ],
        partner: {
          name: 'The Earth Saviours Foundation',
          description: 'Working towards animal rescue, care and safer communities for pets.',
          logo: 'assets/images/earth_saviours_logo.jpg',
          verified: true
        },
        impactStory: {
          image: 'assets/images/pet_impact_story.jpg',
          tag: 'IMPACT STORY',
          quote: 'Every life, no matter how small, matters.'
        },
        description: `<h2><strong>Compassionate Care for Every Animal</strong></h2><p>Every animal deserves love, safety, proper medical care, and a chance to live a healthy, joyful life. Millions of pets and homeless animals face extreme challenges such as hunger, untreated illnesses, vehicular trauma, abandonment, and unsafe weather conditions. The Pet Care initiative is committed to providing prompt rescue, medical attention, nourishment, and secure shelter to innocent voiceless animals.</p><h3><strong>Our Core Mission</strong></h3><p>Our mission is to foster a compassionate society where vulnerable and stray animals receive immediate protection, nourishment, and dignity. Through our verified grassroots partner shelter network, we transform suffering into recovery and hope.</p><h3><strong>How Your Shopping Support Creates Impact</strong></h3><ul><li><strong>Emergency Rescue:</strong> Mobile animal ambulances and rescue teams equipped to handle critical distress calls.</li><li><strong>Nutritious Food & Clean Water:</strong> Daily feeding drives across city zones and shelter kitchens providing healthy meals.</li><li><strong>Veterinary Medical Care:</strong> Crucial surgeries, sterilizations, deworming, rabies vaccination drives, and chronic illness treatment.</li><li><strong>Shelter & Loving Adoptions:</strong> Safe rehabilitation centers where rescued animals heal and find loving forever families.</li></ul><p><strong>Support this cause effortlessly today</strong> — every time you shop through participating stores on Shop4Good, affiliate earnings go directly towards funding animal shelter meals and life-saving veterinary treatments.</p>`,
        goal_amount: 200000,
        raised_amount: 95000,
        donors_count: 310,
        is_active: true,
        is_featured: true,
        starts_at: '2026-01-10T00:00:00Z',
        ends_at: '2026-10-31T23:59:59Z',
        tags: ['Animals', 'Rescue', 'Shelter', 'Care']
      },
      'kids': {
        id: 'kids',
        name: 'Kids Education',
        slug: 'kids-education',
        badge: 'Our cause',
        subtitle: 'Brighter minds for a brighter tomorrow.',
        cover_image_url: 'assets/images/banner-kids.png',
        images: ['assets/images/Kids card photo.jpg'],
        stats: [
          { value: '12,500+', label: 'Children supported', icon: 'users' },
          { value: '50+', label: 'Schools impacted', icon: 'school' }
        ],
        howWeHelp: [
          { title: 'Quality education', desc: 'Providing school bags, notebooks, textbooks, uniforms, and learning essentials.', icon: 'book' },
          { title: 'Learning resources', desc: 'Upgrading village learning spaces with clean desks, safe lights, and library corners.', icon: 'bulb' },
          { title: 'Better futures', desc: 'Daily nutritious meals and quarterly health camps to keep kids strong and focused.', icon: 'grad-cap' }
        ],
        partner: {
          name: 'The Earth Saviours Foundation',
          description: 'Providing quality education to underprivileged children across India.',
          logo: 'assets/images/earth_saviours_logo.jpg',
          verified: true
        },
        impactStory: {
          image: 'assets/images/kids_impact_story.jpg',
          tag: 'IMPACT STORY',
          quote: 'Education opens doors to endless possibilities.'
        },
        description: `<h2><strong>Empower Every Child Through Education</strong></h2><p>Every child deserves the opportunity to learn, grow, and build a brighter future. Many underprivileged children lack access to quality education, essential school supplies, and the learning resources they need to succeed.</p><h3><strong>Our Mission</strong></h3><p>The Kids Education Support initiative aims to make quality education accessible to children from underserved communities by providing essential educational resources, classrooms, and teacher mentorship.</p><h3><strong>How Your Donation Helps</strong></h3><ul><li><strong>School Supplies:</strong> Provide books, notebooks, stationery, and other essential learning materials.</li><li><strong>Quality Education:</strong> Support access to foundational literacy and numeracy programs.</li><li><strong>Better Opportunities:</strong> Help children develop critical life skills and pursue their dreams.</li><li><strong>Brighter Futures:</strong> Empower children to break generational poverty and build thriving communities.</li></ul><p><strong>Together, we can turn dreams into reality — one child, one opportunity, and one brighter future at a time.</strong></p>`,
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
        badge: 'Our cause',
        subtitle: 'Stronger women build stronger communities.',
        cover_image_url: 'assets/images/banner-women.png',
        images: ['assets/images/Women card image.jpg'],
        stats: [
          { value: '5,400+', label: 'Women supported', icon: 'heart' },
          { value: '120+', label: 'Skill programs', icon: 'grad-cap' }
        ],
        howWeHelp: [
          { title: 'Self-dependence', desc: 'Professional skill building in tailoring, handicrafts, computer literacy, and baking.', icon: 'sprout' },
          { title: 'Financial independence', desc: 'Seed funding, micro-finance links, and market access for women entrepreneurs.', icon: 'card' },
          { title: 'Stronger communities', desc: 'Workshops on legal rights, personal health, leadership, and emotional wellbeing.', icon: 'users' }
        ],
        partner: {
          name: 'PraveenLata Sansthan Foundation',
          description: 'Empowering women through education, skill development and livelihood opportunities.',
          logo: 'assets/images/praveenlata_logo.jpg',
          verified: true
        },
        impactStory: {
          image: 'assets/images/women_impact_story.jpg',
          tag: 'IMPACT STORY',
          quote: 'When women grow, communities thrive.'
        },
        description: `<h2><strong>Creating Pathways to Independence</strong></h2><p>Women empowerment is about creating a world where every woman has the opportunity to live independently, make her own decisions, and achieve her aspirations. Many women face structural barriers such as limited educational opportunities, lack of financial independence, and social inequities.</p><h3><strong>Our Mission</strong></h3><p>Our mission is to empower women by providing sustainable livelihood training, financial literacy, and community support groups so they can lead dignified lives.</p><h3><strong>How We Make a Difference</strong></h3><ul><li><strong>Education and Skill Development:</strong> Vocational training that leads directly to earning potential.</li><li><strong>Financial Independence:</strong> Helping women open bank accounts, save safely, and manage family finances.</li><li><strong>Women Entrepreneurship:</strong> Encouraging micro-businesses, cooperative marketing, and self-reliance.</li><li><strong>Community Safety:</strong> Promoting gender equality, legal literacy, and safety networks.</li></ul>`,
        goal_amount: 300000,
        raised_amount: 85000,
        donors_count: 180,
        is_active: true,
        is_featured: true,
        starts_at: '2026-02-15T00:00:00Z',
        ends_at: '2026-11-30T23:59:59Z',
        tags: ['Women', 'Empowerment', 'Livelihood']
      },
      'senior': {
        id: 'senior',
        name: 'Senior Citizen Care',
        slug: 'senior-citizen-care',
        badge: 'Our cause',
        subtitle: 'Respect, care and a more dignified tomorrow.',
        cover_image_url: 'assets/images/banner-elder.png',
        images: ['assets/images/Senior Citizen Card Image.jpg'],
        stats: [
          { value: '8,200+', label: 'Senior citizens supported', icon: 'users' },
          { value: '30+', label: 'Care centres', icon: 'home' }
        ],
        howWeHelp: [
          { title: 'Healthcare support', desc: 'Regular medical check-ups, physiotherapy sessions, and consistent access to essential medicines.', icon: 'stethoscope' },
          { title: 'Emotional wellness', desc: 'Volunteer visits, cultural activities, and festive celebrations to combat loneliness and bring joy.', icon: 'heart' },
          { title: 'Better living conditions', desc: 'Safe accommodation, nutritious meals, and essential supplies for a comfortable and dignified life.', icon: 'home' }
        ],
        partner: {
          name: 'The Earth Saviours Foundation',
          description: 'Working for the health, care and dignity of senior citizens across India.',
          logo: 'assets/images/earth_saviours_logo.jpg',
          verified: true
        },
        impactStory: {
          image: 'assets/images/senior_impact_story.jpg',
          tag: 'IMPACT STORY',
          quote: 'Because they cared for us, now it’s our turn.'
        },
        description: `<h2><strong>Honoring and Caring for Our Elders</strong></h2><p>Every senior citizen deserves respect, love, attentive care, and the opportunity to live with joy and dignity. Many elderly individuals suffer from physical frailty, loneliness, chronic health concerns, or abandonment.</p><h3><strong>Our Mission</strong></h3><p>Our mission is to ensure elderly citizens receive the shelter, nutrition, healthcare, and emotional warmth they need to enjoy peaceful golden years.</p><h3><strong>How We Make a Difference</strong></h3><ul><li><strong>Healthcare Support:</strong> Regular visits by doctors, round-the-clock nursing care, and emergency hospital access.</li><li><strong>Food & Nutrition:</strong> Fresh, doctor-customized hot meals and dietary supplements daily.</li><li><strong>Safe Living:</strong> Upgraded old age home facilities with safety railings, clean washrooms, and recreational spaces.</li><li><strong>Loving Companionship:</strong> Community interaction and recreational activities to alleviate depression and loneliness.</li></ul>`,
        goal_amount: 800000,
        raised_amount: 320000,
        donors_count: 412,
        is_active: true,
        is_featured: true,
        starts_at: '2026-03-01T00:00:00Z',
        ends_at: '2026-12-31T23:59:59Z',
        tags: ['Seniors', 'Healthcare', 'Shelter', 'Dignity']
      }
    };

    const mockItem = mockItems[id] || mockItems['pets'];

    this.causeDetail = mockItem;
    
    this.ngo = {
      id: mockItem.id,
      name: mockItem.name,
      slug: mockItem.slug,
      coverImage: mockItem.cover_image_url,
      logo: mockItem.partner.logo,
      causes: mockItem.tags,
      shortDescription: mockItem.subtitle,
      longDescription: mockItem.description,
      causeDetail: this.causeDetail
    };

    this.isLoading = false;
  }
}
