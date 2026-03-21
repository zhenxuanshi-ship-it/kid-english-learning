import { allWords } from '../data/words';
import type { Word } from '../types/word';
import { getCategoryLabel } from './category';
import type { LearningStats } from './stats';

const categoryTaglineMap: Record<string, string> = {
  animals: '认识可爱小动物朋友',
  fruits: '一起逛逛水果乐园',
  colors: '给世界涂上颜色',
  numbers: '数一数数字小伙伴',
  family: '认识温暖的家人称呼',
  school: '走进每天的校园生活',
  food: '看看今天想吃什么',
  body: '认识自己的身体部位',
  clothes: '挑挑今天穿什么',
  weather: '抬头看看今天的天空',
};

export interface CategoryGalleryItem {
  category: string;
  label: string;
  total: number;
  learned: number;
  mastered: number;
  progressPercent: number;
  featuredWord: string;
  featuredChinese: string;
  featuredVisual?: Word;
  tagline: string;
  recommendation: string;
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

    const label = getCategoryLabel(category);
    const tagline = categoryTaglineMap[category] ?? `来看看${label}主题`;
    const recommendation = learned === 0
      ? `先从 ${featured?.english ?? label} 开始认识吧`
      : mastered > 0
        ? `已经掌握 ${mastered} 个，继续挑战 ${featured?.english ?? label}`
        : `已经学了 ${learned} 个，再看看 ${featured?.english ?? label}`;

    return {
      category,
      label,
      total,
      learned,
      mastered,
      progressPercent,
      featuredWord: featured?.english ?? '',
      featuredChinese: featured?.chinese ?? '',
      featuredVisual: featured,
      tagline,
      recommendation,
    };
  });
}
