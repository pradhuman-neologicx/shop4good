import { NgOptimizedImage } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage],
})
export class FaqComponent {
  openIndex: number | null = 0;

  faqs = [
    {
      question: 'How does Shop4Good work?',
      answer:
        'Shop4Good partners with your favourite brands. When you shop through our platform, the retailer pays us a commission. We donate a portion of that commission to your chosen cause — at zero extra cost to you.',
    },
    {
      question: 'Is there any extra cost to me?',
      answer:
        'Absolutely not! You pay the same price as you would shopping directly. The donation comes from the retailer\'s commission, not from your pocket.',
    },
    {
      question: 'How long does it take for the donation to process?',
      answer:
        'It typically takes 14 days for the purchase to be confirmed by the retailer. Once confirmed, the 2% commission is tracked and distributed to your selected cause.',
    },
    {
      question: 'Can I choose which NGO receives my donation?',
      answer:
        'Yes! You can select from our list of verified NGOs and charities. You can change your chosen cause at any time from your dashboard.',
    },
    {
      question: 'Which brands are available on Shop4Good?',
      answer:
        'We partner with 1000+ brands including Amazon, Flipkart, Myntra, Ajio, Nykaa, Meesho, and many more. New brands are added regularly.',
    },
    {
      question: 'How do I track my impact?',
      answer:
        'Once you create a free account, you\'ll have access to a personal dashboard that shows your total purchases, donations generated, and the causes you\'ve supported.',
    },
  ];

  toggle(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
