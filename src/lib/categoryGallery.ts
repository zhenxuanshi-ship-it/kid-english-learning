import { allWords } from '../data/words';
import { getCategoryLabel } from './category';
import type { LearningStats } from './stats';

export interface CategoryGalleryItem {
  category: string;
  label: string;
  total: number;
  learned: number;
  mastered: number;
  progressPercent: number;
  featuredWord: string;
  featuredChinese: string;
}

export function buildCategoryGalleryItems(categories: string[], stats: LearningStats): CategoryGalleryItem[] {
  return categories.map((category) => {
    const summary = stats.categoryBreakdown.find((item) => item.category === category);
    const words = allWords.filter((word) => word.category === category);
    const featured = words[0];
    const total = summary?.total ?? words.length;
    const learned = summary?.learned ?? 0;
    const mastered = summary?.mastered ?? 0;
    const progressPercent = total > 0 ? Math.round((learned / total) * 100) : 0;

    return {
      category,
      label: getCategoryLabel(category),
      total,
      learned,
      mastered,
      progressPercent,
      featuredWord: featured?.english ?? '',
      featuredChinese: featured?.chinese ?? '',
    };
  });
}
