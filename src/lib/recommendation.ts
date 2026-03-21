import type { LearningStats } from './stats';

export interface HomeRecommendation {
  title: string;
  description: string;
  focus: 'new' | 'review' | 'practice' | 'mixed';
  suggestedCategory?: string;
}

function getSuggestedCategory(stats: LearningStats, focus: HomeRecommendation['focus']): string | undefined {
  const sorted = [...stats.categoryBreakdown].sort((a, b) => {
    if (focus === 'new') {
      return (b.total - b.learned) - (a.total - a.learned);
    }
    if (focus === 'practice') {
      return (b.learned - b.mastered) - (a.learned - a.mastered);
    }
    return (b.total - b.mastered) - (a.total - a.mastered);
  });

  return sorted[0]?.category;
}

export function getHomeRecommendation(stats: LearningStats): HomeRecommendation {
  if (stats.stageCounts.review > 0) {
    return {
      title: '先复习一下旧词',
      description: `你有 ${stats.stageCounts.review} 个待复习词，先把容易忘的词捡回来。`,
      focus: 'review',
      suggestedCategory: getSuggestedCategory(stats, 'review'),
    };
  }

  if (stats.stageCounts.new > 0) {
    return {
      title: '今天先认识新词',
      description: `还有 ${stats.stageCounts.new} 个新词没学，先从新内容开始。`,
      focus: 'new',
      suggestedCategory: getSuggestedCategory(stats, 'new'),
    };
  }

  if (stats.stageCounts.practicing > 0 || stats.stageCounts.learning > 0) {
    return {
      title: '继续巩固今天的进度',
      description: '有一些词还在学习中，继续练一下会更稳。',
      focus: 'practice',
      suggestedCategory: getSuggestedCategory(stats, 'practice'),
    };
  }

  return {
    title: '来一轮综合练习',
    description: '当前没有明显积压内容，适合做一轮轻松复习。',
    focus: 'mixed',
    suggestedCategory: getSuggestedCategory(stats, 'mixed'),
  };
}
