export const CV_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, professional layout with emphasis on skills',
    thumbnail: '/images/templates/modern-preview.jpg',
    category: 'Professional',
    sections: ['header', 'summary', 'experience', 'education', 'skills'],
    layout: 'single-column',
    defaultColors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      text: '#374151',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'Segoe UI, sans-serif',
      body: 'Segoe UI, sans-serif'
    },
    customizable: ['primaryColor', 'secondaryColor', 'headingFont', 'bodyFont', 'backgroundColor'],
    isPopular: false
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design perfect for creative industries',
    thumbnail: '/images/templates/creative-preview.jpg',
    category: 'Creative',
    sections: ['header', 'portfolio', 'skills', 'experience', 'education'],
    layout: 'two-column',
    defaultColors: {
      primary: '#7c3aed',
      secondary: '#5b21b6',
      text: '#374151',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif'
    },
    customizable: ['primaryColor', 'secondaryColor', 'headingFont', 'bodyFont', 'backgroundColor'],
    isPopular: false
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format preferred by conservative industries',
    thumbnail: '/images/templates/classic-preview.jpg',
    category: 'Traditional',
    sections: ['header', 'experience', 'education', 'skills', 'references'],
    layout: 'single-column',
    defaultColors: {
      primary: '#374151',
      secondary: '#111827',
      text: '#000000',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'Times New Roman, serif',
      body: 'Times New Roman, serif'
    },
    customizable: ['primaryColor', 'textColor', 'headingFont', 'bodyFont', 'backgroundColor'],
    isPopular: false
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and focused on content',
    thumbnail: '/images/templates/minimal-preview.jpg',
    category: 'Minimalist',
    sections: ['header', 'experience', 'education'],
    layout: 'single-column',
    defaultColors: {
      primary: '#000000',
      secondary: '#666666',
      text: '#333333',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'Helvetica Neue, Arial, sans-serif',
      body: 'Helvetica Neue, Arial, sans-serif'
    },
    customizable: ['primaryColor', 'textColor', 'headingFont', 'bodyFont', 'backgroundColor'],
    isPopular: false
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior-level professionals',
    thumbnail: '/images/templates/executive-preview.jpg',
    category: 'Professional',
    sections: ['header', 'summary', 'experience', 'education', 'skills', 'achievements'],
    layout: 'single-column',
    defaultColors: {
      primary: '#059669',
      secondary: '#047857',
      text: '#1f2937',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'Georgia, serif',
      body: 'Georgia, serif'
    },
    customizable: ['primaryColor', 'secondaryColor', 'headingFont', 'bodyFont', 'backgroundColor'],
    isPopular: false
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Structured layout ideal for engineers and developers',
    thumbnail: '/images/templates/technical-preview.jpg',
    category: 'Professional',
    sections: ['header', 'summary', 'skills', 'experience', 'education', 'projects'],
    layout: 'two-column',
    defaultColors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      text: '#374151',
      background: '#ffffff'
    },
    defaultFonts: {
      heading: 'Courier New, monospace',
      body: 'Arial, sans-serif'
    },
    customizable: ['primaryColor', 'secondaryColor', 'headingFont', 'bodyFont', 'backgroundColor'],
    isPopular: false
  }
];