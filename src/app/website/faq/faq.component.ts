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

  // FAQs from Slide 8
  faqs: FaqItem[] = [
    {
      id: 1,
      question: 'How does Shop4Good work?',
      answer:
        'Shop4Good partners with your favourite brands. When you shop through our platform, the retailer pays us a commission. We donate a portion of that commission to your chosen cause – at zero extra cost to you.',
      category: 'General'
    },
    {
      id: 2,
      question: 'Is there any extra cost to me?',
      answer:
        "Absolutely not! You pay the same price as you would shopping directly. The donation comes from the retailer's commission, not from your pocket.",
      category: 'Pricing'
    },
    {
      id: 3,
      question: 'How long does it take for the donation to process?',
      answer:
        'It typically takes 14-30 days for the purchase to be confirmed by the retailer. Once confirmed, the 2% commission is tracked and distributed to your selected cause. We disburse the money on a monthly basis.',
      category: 'Donations'
    },
    {
      id: 4,
      question: 'Can I choose which NGO receives my donation?',
      answer:
        'Yes! You can select from our list of NGOs and charities. You can change your chosen cause at any time from your dashboard.',
      category: 'Causes'
    },
    {
      id: 5,
      question: 'Which brands are available on Shop4Good?',
      answer:
        'We partner with 100+ brands including Amazon, Flipkart, Myntra, Ajio, Nykaa, and many more. New brands are added regularly',
      category: 'Brands'
    },
    {
      id: 6,
      question: 'How do I track my impact?',
      answer:
        "Once you create a free account, you'll have access to a personal dashboard that shows your total purchases, donations generated, and the causes you've supported.",
      category: 'Impact'
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
