// templates.js
export const CV_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional layout with emphasis on skills',
    thumbnail: '/images/templates/modern-preview.jpg',
    category: 'Professional',
    sections: ['header', 'summary', 'experience', 'education', 'skills'],
    layout: 'single-column',
    colors: ['#2563eb', '#1e40af'],
    isPopular: true
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design perfect for creative industries',
    thumbnail: '/images/templates/creative-preview.jpg',
    category: 'Creative',
    sections: ['header', 'portfolio', 'skills', 'experience', 'education'],
    layout: 'two-column',
    colors: ['#7c3aed', '#5b21b6']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format preferred by conservative industries',
    thumbnail: '/images/templates/classic-preview.jpg',
    category: 'Traditional',
    sections: ['header', 'experience', 'education', 'skills', 'references'],
    layout: 'single-column',
    colors: ['#374151', '#111827']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and focused on content',
    thumbnail: '/images/templates/minimal-preview.jpg',
    category: 'Minimalist',
    sections: ['header', 'experience', 'education'],
    layout: 'single-column',
    colors: ['#000000', '#666666']
  }
];