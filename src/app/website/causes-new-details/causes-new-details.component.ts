import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

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
  bgColor?: string;
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
  bgColor?: string;
  quotes?: string;
  quote?: string;
  web_link?: string;
  web_link_name?: string;
}

@Component({
  selector: 'app-causes-new-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './causes-new-details.component.html',
  styleUrl: './causes-new-details.component.scss'
})
export class CausesNewDetailsComponent implements OnInit {
  ngo: any | undefined;
  isLoading: boolean = true;
  currentId: string = 'pets';
  
  isConfirmModalOpen = false;
  isConfirmedSuccess = false;
  isCurrentCauseSupported = false;

  causeDetail: CauseItem | any = null;
  selectedImageIndex = 0;

  copySuccess: boolean = false;
  private copyTimeout: any = null;

  otherCauses = [
    {
      id: 'kids',
      title: 'Child Education',
      subtitle: 'Every Child Deserves a Brighter Tomorrow.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#1e3a8a',
      description: 'A brighter future begins with the opportunity to learn. Every child deserves the chance to dream, discover, and build a future filled with possibilities. Yet, for many children, access to quality education remains a distant dream. At Shop4Goods, we believe education is more than a fundamental right—it is the foundation of opportunity, independence, and lasting change.\n\nBy supporting child education, we help open doors to knowledge, nurture young minds, and empower the next generation to shape a better world.',
      quotes: 'Because when we educate a child, we empower a lifetime.',
      quote: 'Because when we educate a child, we empower a lifetime.'
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      subtitle: 'Empower Her, Empower the World',
      foundation: 'PraveenLata Sansthan Foundation',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#d2386c',
      description: 'When women rise, communities thrive. Every woman deserves the freedom to dream big, the opportunity to achieve her ambitions, and the confidence to shape her own future. Yet, countless women continue to face barriers to education, financial independence, equal opportunities, and self-expression.\n\nShop4Goods believes that empowering women means creating opportunities for them to lead, grow, and thrive on their own terms. By supporting women empowerment, we champion equality, strengthen families, and help build a society where every woman has the power to realize her potential.',
      quotes: "Because an empowered woman doesn't just change her life—she can change the world.",
      quote: "Because an empowered woman doesn't just change her life—she can change the world."
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      subtitle: 'Every Elder Deserves Dignity and Love.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#4a8dd6',
      description: "They spent a lifetime caring for others. Now, it's our turn. Our senior citizens carry a lifetime of memories, wisdom, sacrifices, and stories that have helped shape our families and communities. They deserve more than gratitude—they deserve respect, companionship, comfort, and compassionate care.\n\nAt Shop4Goods, we believe that growing older should never mean feeling forgotten or alone. Through our commitment to senior citizen care, we aspire to support a world where every elder feels valued, protected, included, and loved.",
      quotes: 'Because age may change a life, but it should never diminish its worth.',
      quote: 'Because age may change a life, but it should never diminish its worth.'
    },
    {
      id: 'pets',
      title: 'Animal Welfare',
      subtitle: 'Every Life Deserves Kindness.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#245e55',
      description: 'They may not have a voice, but they deserve to be heard. Animals bring companionship, joy, and balance to our world, yet many face hunger, abandonment, neglect, and suffering. Every animal deserves a life free from cruelty, with access to food, shelter, protection, and compassionate care.\n\nAt Shop4Goods, we believe kindness should extend to every living being. By supporting animal welfare, we stand for responsible care, humane treatment, and a world where compassion guides the way we treat the animals who share our planet.',
      quotes: 'Because kindness has no species, and compassion should have no boundaries.',
      quote: 'Because kindness has no species, and compassion should have no boundaries.'
    }
  ];

  get filteredOtherCauses() {
    return this.otherCauses.filter(c => c.id !== this.currentId);
  }

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkIfCauseSupported();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentId = id;
        this.loadMockData(id);
        this.checkIfCauseSupported();
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.cdr.detectChanges();
      }
    });
  }

  checkIfCauseSupported(): void {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('shop4good_supported_cause');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.isCurrentCauseSupported = parsed?.id === this.currentId || (this.causeDetail && parsed?.id === this.causeDetail.id);
      } else {
        this.isCurrentCauseSupported = false;
      }
    } catch {
      this.isCurrentCauseSupported = false;
    }
  }

  openConfirmModal(): void {
    this.checkIfCauseSupported();
    this.isConfirmedSuccess = false;
    this.isConfirmModalOpen = true;
    this.cdr.detectChanges();
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
    this.isConfirmedSuccess = false;
    this.cdr.detectChanges();
  }

  confirmSupportCause(): void {
    if (!this.causeDetail) return;

    const causePayload = {
      id: this.causeDetail.id,
      title: this.causeDetail.name,
      subtitle: this.causeDetail.subtitle || '',
      foundation: this.causeDetail.partner?.name || '',
      image: (this.causeDetail.images && this.causeDetail.images[0]) || this.causeDetail.cover_image_url || '',
      bgColor: this.causeDetail.bgColor || '#087F6A'
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shop4good_supported_cause', JSON.stringify(causePayload));
        this.isCurrentCauseSupported = true;
      } catch (e) {
        console.error('Failed to save supported cause:', e);
      }
    }

    try {
      this.notificationService.show(`You are now supporting ${this.causeDetail.name}!`, 'success');
    } catch (e) {
      // fallback
    }

    this.closeConfirmModal();
    // this.router.navigate(['/shop']);
  }

  goToShop(): void {
    this.closeConfirmModal();
    this.router.navigate(['/shop']);
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
        name: 'Animal Welfare',
        slug: 'pet-care',
        badge: 'Our cause',
        subtitle: 'Every Life Deserves Kindness.',
        cover_image_url: 'assets/images/banner-pets.png',
        images: ['assets/images/Dog Card photo.jpg'],
        web_link: 'www.friendicoes.org',
        web_link_name: 'Friendicoes',
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
          logo: 'assets/images/earth_saviours_logo.png',
          verified: true
        },
        bgColor: '#245e55',
        impactStory: {
          image: 'assets/images/3974b9a0688a2a111c798f118707a04eefd027aa.png',
          tag: 'IMPACT STORY',
          quote: 'Every life, no matter how small, matters.',
          bgColor: '#245e55'
        },
        description: `They may not have a voice, but they deserve to be heard. Animals bring companionship, joy, and balance to our world, yet many face hunger, abandonment, neglect, and suffering. Every animal deserves a life free from cruelty, with access to food, shelter, protection, and compassionate care.

At Shop4Goods, we believe kindness should extend to every living being. By supporting animal welfare, we stand for responsible care, humane treatment, and a world where compassion guides the way we treat the animals who share our planet.`,
        quotes: 'Because kindness has no species, and compassion should have no boundaries.',
        quote: 'Because kindness has no species, and compassion should have no boundaries.',
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
        name: 'Child Education',
        slug: 'kids-education',
        badge: 'Our cause',
        subtitle: 'Every Child Deserves a Brighter Tomorrow.',
        cover_image_url: 'assets/images/banner-kids.png',
        images: ['assets/images/Kids card photo.jpg'],
        web_link: 'www.spreadingsmilesnathupur.org',
        web_link_name: 'Spreading Smiles Foundation',
        stats: [
          { value: '12,500+', label: 'Children supported', icon: 'users' },
          { value: '50+', label: 'Schools impacted', icon: 'school' }
        ],
        howWeHelp: [
          { title: 'Quality education', desc: 'Classroom support and trained teachers for underserved schools.', icon: 'book' },
          { title: 'Learning resources', desc: 'Books, digital tools and learning kits for every child.', icon: 'bulb' },
          { title: 'Better futures', desc: 'Scholarships and mentoring that open new doors.', icon: 'grad-cap' }
        ],
        partner: {
          name: 'The Earth Saviours Foundation',
          description: 'Providing quality education to underprivileged children across India.',
          logo: 'assets/images/earth_saviours_logo.png',
          verified: true
        },
        bgColor: '#1e3a8a',
        impactStory: {
          image: 'assets/images/cc81b811bb1cdb869786fe9f853ae5a6d1184f89.png',
          tag: 'IMPACT STORY',
          quote: 'Education opens doors to endless possibilities.',
          bgColor: '#1e3a8a'
        },
        description: `A brighter future begins with the opportunity to learn. Every child deserves the chance to dream, discover, and build a future filled with possibilities. Yet, for many children, access to quality education remains a distant dream. At Shop4Goods, we believe education is more than a fundamental right—it is the foundation of opportunity, independence, and lasting change.

By supporting child education, we help open doors to knowledge, nurture young minds, and empower the next generation to shape a better world.`,
        quotes: 'Because when we educate a child, we empower a lifetime.',
        quote: 'Because when we educate a child, we empower a lifetime.',
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
        subtitle: 'Empower Her, Empower the World',
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
          logo: 'assets/images/praveenlata_logo.png',
          verified: true
        },
        bgColor: '#d2386c',
        impactStory: {
          image: 'assets/images/b10176811492927d6241054c868b168d16c6af4e.png',
          tag: 'IMPACT STORY',
          quote: 'When women grow, communities thrive.',
          bgColor: '#d2386c'
        },
        description: `When women rise, communities thrive. Every woman deserves the freedom to dream big, the opportunity to achieve her ambitions, and the confidence to shape her own future. Yet, countless women continue to face barriers to education, financial independence, equal opportunities, and self-expression.

Shop4Goods believes that empowering women means creating opportunities for them to lead, grow, and thrive on their own terms. By supporting women empowerment, we champion equality, strengthen families, and help build a society where every woman has the power to realize her potential.`,
        quotes: "Because an empowered woman doesn't just change her life—she can change the world.",
        quote: "Because an empowered woman doesn't just change her life—she can change the world.",
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
        subtitle: 'Every Elder Deserves Dignity and Love.',
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
          logo: 'assets/images/earth_saviours_logo.png',
          verified: true
        },
        bgColor: '#4a8dd6',
        impactStory: {
          image: 'assets/images/d3f2563f455e58bf105b9c450b3aee8a40e12f0f.png',
          tag: 'IMPACT STORY',
          quote: 'Because they cared for us, now it’s our turn.',
          bgColor: '#4a8dd6'
        },
        description: `They spent a lifetime caring for others. Now, it's our turn. Our senior citizens carry a lifetime of memories, wisdom, sacrifices, and stories that have helped shape our families and communities. They deserve more than gratitude —they deserve respect, companionship, comfort, and compassionate care.

At Shop4Goods, we believe that growing older should never mean feeling forgotten or alone. Through our commitment to senior citizen care, we aspire to support a world where every elder feels valued, protected, included, and loved.`,
        quotes: 'Because age may change a life, but it should never diminish its worth.',
        quote: 'Because age may change a life, but it should never diminish its worth.',
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

    this.checkIfCauseSupported();
    this.isLoading = false;
  }
}
