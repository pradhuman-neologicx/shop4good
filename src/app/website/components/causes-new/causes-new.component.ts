import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Cause {
  id: string;
  title: string;
  subtitle: string;
  foundation: string;
  image: string;
  bgColor: string;
}

@Component({
  selector: 'app-causes-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './causes-new.component.html',
  styleUrl: './causes-new.component.scss'
})
export class CausesNewComponent {
  causes: Cause[] = [
    {
      id: 'kids',
      title: 'Kids Education',
      subtitle: 'Brighter minds for a brighter tomorrow',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Kids card photo.jpg',
      bgColor: '#37426F' // Dark Blue
    },
    {
      id: 'women',
      title: 'Women Empowerment',
      subtitle: 'Stronger Women Build Stronger Communities',
      foundation: 'PraveenLata Sansthan Foundation',
      image: 'assets/images/Women card image.jpg',
      bgColor: '#087F6A' // Teal Green
    },
    {
      id: 'senior',
      title: 'Senior Citizen Care',
      subtitle: 'Respect, care and a more dignified tomorrow.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Senior Citizen Card Image.jpg',
      bgColor: '#24272C' // Dark Grey
    },
    {
      id: 'pets',
      title: 'Pet Care',
      subtitle: 'Better care for happier companions.',
      foundation: 'The Earth Saviours Foundation',
      image: 'assets/images/Dog Card photo.jpg',
      bgColor: '#7A263A' // Red
    }
  ];

  selectedCauseId: string | null = null;

  selectCause(id: string) {
    this.selectedCauseId = id;
  }
}
