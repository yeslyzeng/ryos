// Globe-centric desktop types

export interface GlobePin {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
  };
  content: PinContent;
  createdAt: string;
  updatedAt: string;
}

export interface PinContent {
  type: 'article' | 'gallery' | 'link' | 'interactive';
  // For articles
  text?: string;
  // For galleries
  images?: PinImage[];
  // For links
  links?: PinLink[];
  // For interactive experiences
  embedUrl?: string;
  // Common
  coverImage?: string;
}

export interface PinImage {
  url: string;
  caption?: string;
  alt?: string;
}

export interface PinLink {
  url: string;
  title: string;
  description?: string;
  favicon?: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string; // emoji or icon path
  color: string; // accent color for pins
  description?: string;
  pinCount?: number;
}

export interface GlobeState {
  activeTopic: string | null;
  selectedPin: string | null;
  cameraPosition: {
    lat: number;
    lng: number;
    altitude: number;
  };
  isRotating: boolean;
}

// Default topics
export const DEFAULT_TOPICS: Topic[] = [
  {
    id: 'architecture',
    name: 'Architecture',
    icon: '🏛️',
    color: '#8B9A7B', // sage green
    description: 'Buildings, structures, and spatial design around the world',
  },
  {
    id: 'linguistics',
    name: 'Linguistics',
    icon: '🗣️',
    color: '#E8B4A0', // soft coral
    description: 'Languages, dialects, and linguistic phenomena',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    color: '#7A8A6A', // deep sage
    description: 'Natural wonders and ecological discoveries',
  },
  {
    id: 'culture',
    name: 'Culture',
    icon: '🎭',
    color: '#D4C4E8', // soft lavender
    description: 'Art, traditions, and cultural expressions',
  },
];

// Sample pins for demonstration
export const SAMPLE_PINS: GlobePin[] = [
  {
    id: 'pin-1',
    topicId: 'architecture',
    title: 'Sagrada Família',
    description: 'Antoni Gaudí\'s unfinished masterpiece',
    location: { lat: 41.4036, lng: 2.1744 },
    content: {
      type: 'article',
      text: 'The Basílica de la Sagrada Família is a large unfinished Roman Catholic minor basilica in Barcelona, designed by Catalan architect Antoni Gaudí.',
      coverImage: '/images/sagrada-familia.jpg',
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'pin-2',
    topicId: 'linguistics',
    title: 'Basque Language',
    description: 'A language isolate in Europe',
    location: { lat: 43.2630, lng: -2.9350 },
    content: {
      type: 'article',
      text: 'Basque is a language isolate ancestral to the Basque people. It is spoken by about 750,000 people in the Basque Country.',
      links: [
        { url: 'https://en.wikipedia.org/wiki/Basque_language', title: 'Wikipedia' },
      ],
    },
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
];
