export interface Word {
  id: number;
  english: string;
  chinese: string;
  category: string;
  level: 1 | 2 | 3;
  difficulty: number;
  emoji?: string;
  imageUrl?: string;
  audioUrl?: string;
  sourceAliases?: string[];
}
