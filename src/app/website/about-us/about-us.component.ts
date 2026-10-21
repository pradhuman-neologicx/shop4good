import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  causes = [
    {
      id: 'kids',
      title: 'Kids Education',
      tagline: 'Because education can change the trajectory of a child’s life.',
      description: 'Support schools, scholarships, and teachers in underserved communities.',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#1e3a8a',
      link: '/causes/kids'
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      tagline: 'When a woman earns and learns, the impact transforms families and whole communities.',
      description: 'Back programmes that provide skills training, legal aid, and financial independence.',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#d2386c',
      link: '/causes/women'
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      tagline: 'Every elderly person deserves dignity, care, and a reliable hand.',
      description: 'Help provide shelter, medical aid, and compassionate daily care to seniors in need.',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#4a8dd6',
      link: '/causes/senior'
    },
    {
      id: 'pets',
      title: 'Animal Welfare',
      tagline: 'Compassion for every voiceless creature that shares our world.',
      description: 'Support rescue shelters, veterinary drives, and wildlife protection.',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#245e55',
      link: '/causes/pets'
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
