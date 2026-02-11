
export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: 'Classic' | 'Action' | 'Puzzle' | 'Arcade' | 'AI-Gen';
  tags: string[];
  isInternal?: boolean;
  internalCode?: string;
}

export interface AIGenResult {
  code: string;
  explanation: string;
}

export enum Page {
  Home = 'home',
  Library = 'library',
  AILab = 'ailab',
  Play = 'play'
}
