import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FaqComponent {
  searchQuery: string = '';

  // All 9 FAQs from the Figma design
  faqs: FaqItem[] = [
    {
      id: 1,
      question: 'What is Shop4Good?',
      answer: 'Shop4Good is a shopping platform that donates 2% of every order to a cause you choose — at no extra cost to you.',
      category: 'General'
    },
    {
      id: 2,
      question: 'How does the donation work?',
      answer: 'When you shop through Shop4Good, the brand pays us an affiliate commission. We send 2% of your order value directly to the NGO behind your chosen cause.',
      category: 'Donations'
    },
    {
      id: 3,
      question: 'Does it cost me anything extra?',
      answer: "No. You pay the brand's regular price — the donation comes from the brand's commission, not your pocket.",
      category: 'Pricing'
    },
    {
      id: 4,
      question: 'Which brands are available?',
      answer: 'Right now you can shop at Amazon, Flipkart, Tata CLiQ and Nykaa, with more partners coming soon.',
      category: 'Brands'
    },
    {
      id: 5,
      question: 'Can I change my cause later?',
      answer: 'Yes. Go to My Profile → Change cause and pick a different cause at any time. You can support one cause at a time.',
      category: 'Account'
    },
    {
      id: 6,
      question: 'How do I know my donation made an impact?',
      answer: "Your profile shows how much you've donated and how many lives you've impacted, and our NGO partners share regular impact updates.",
      category: 'Impact'
    },
    {
      id: 7,
      question: 'Do you work with verified NGOs?',
      answer: 'Yes. Every NGO partner is checked for registration, transparency and on-ground impact before joining.',
      category: 'NGOs'
    },
    {
      id: 8,
      question: 'Is my personal information safe?',
      answer: 'Yes. We never sell your data and use industry-standard security to protect it. See our Privacy Policy for details.',
      category: 'Security'
    },
    {
      id: 9,
      question: 'How can my brand partner with you?',
      answer: 'Go to Partner With Us → For Brands, or write to support@shop4good.com and our team will get in touch.',
      category: 'Partnership'
    }
  ];

  // By default, all FAQ items are collapsed.
  openIds: Set<number> = new Set<number>();

  get filteredFaqs(): FaqItem[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.faqs;
    }
    return this.faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }

  toggleFaq(id: number): void {
    if (this.openIds.has(id)) {
      this.openIds.delete(id);
    } else {
      this.openIds.add(id);
    }
  }

  isOpen(id: number): boolean {
    // If user is actively searching, auto-expand all matched results
    if (this.searchQuery.trim().length > 0) {
      return true;
    }
    return this.openIds.has(id);
  }

  expandAll(): void {
    this.faqs.forEach(f => this.openIds.add(f.id));
  }

  collapseAll(): void {
    this.openIds.clear();
  }

  clearSearch(): void {
    this.searchQuery = '';
  }
}
