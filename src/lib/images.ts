import type { Word } from '../types/word';

const categoryImageMap: Record<string, string> = {
  animals: '🐾',
  fruits: '🍓',
  colors: '🎨',
  numbers: '🔢',
  family: '🏠',
  school: '📚',
  food: '🍽️',
  body: '🧍',
  clothes: '👕',
  weather: '🌤️',
};

export interface WordVisualResource {
  imageUrl?: string;
  fallbackEmoji: string;
  categoryCover: string;
}

export function getWordVisualResource(word: Word): WordVisualResource {
  return {
    imageUrl: word.imageUrl,
    fallbackEmoji: word.emoji ?? '🧩',
    categoryCover: categoryImageMap[word.category] ?? '📘',
  };
}
