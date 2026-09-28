export interface Ngo {
  id: number;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  shortDescription: string;
  longDescription: string;
  causes: string[];
  location: string;
  establishedYear: number;
  website: string;
}

export const MOCK_NGOS: Ngo[] = [
  {
    id: 1,
    name: 'Green Earth Foundation',
    slug: 'green-earth-foundation',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=400&fit=crop',
    shortDescription: 'Dedicated to preserving our planet through afforestation and sustainable living.',
    longDescription: 'Green Earth Foundation is a non-profit organization that has been working since 2005 to combat climate change. We plant trees, organize clean-up drives, and educate communities about sustainable living practices. Our mission is to leave a greener, healthier planet for future generations.',
    causes: ['Environment', 'Sustainability', 'Climate Change'],
    location: 'New York, USA',
    establishedYear: 2005,
    website: 'https://example.com'
  },
  {
    id: 2,
    name: 'EduCare Global',
    slug: 'educare-global',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=400&fit=crop',
    shortDescription: 'Providing quality education to underprivileged children worldwide.',
    longDescription: 'EduCare Global believes that education is a fundamental human right. We build schools, provide scholarships, and train teachers in developing countries. Over the past decade, we have helped over 50,000 children access quality education and build a better future for themselves.',
    causes: ['Education', 'Children', 'Poverty Alleviation'],
    location: 'London, UK',
    establishedYear: 2010,
    website: 'https://example.com'
  },
  {
    id: 3,
    name: 'Paws & Claws Rescue',
    slug: 'paws-and-claws-rescue',
    logo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=400&fit=crop',
    shortDescription: 'Rescuing, rehabilitating, and rehoming abandoned and abused animals.',
    longDescription: 'Paws & Claws Rescue is a no-kill animal shelter. We take in stray, abandoned, and abused animals, provide them with medical care, rehabilitation, and a safe place to stay until they find their forever homes. We also advocate for animal rights and promote responsible pet ownership.',
    causes: ['Animal Welfare', 'Rescue', 'Advocacy'],
    location: 'Toronto, Canada',
    establishedYear: 2018,
    website: 'https://example.com'
  },
  {
    id: 4,
    name: 'Health for All',
    slug: 'health-for-all',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&h=150&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=400&fit=crop',
    shortDescription: 'Ensuring access to basic healthcare services in remote areas.',
    longDescription: 'Health for All operates mobile clinics that travel to remote and underserved areas, providing essential healthcare services, vaccinations, and health education. We believe that geographic location should not be a barrier to receiving quality medical care.',
    causes: ['Health', 'Medical Relief', 'Community Outreach'],
    location: 'Nairobi, Kenya',
    establishedYear: 2012,
    website: 'https://example.com'
  }
];
