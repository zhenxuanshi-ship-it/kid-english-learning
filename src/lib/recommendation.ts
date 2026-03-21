import type { LearningStats } from './stats';

export interface HomeRecommendation {
  title: string;
  description: string;
  focus: 'new' | 'review' | 'practice' | 'mixed';
}

export function getHomeRecommendation(stats: LearningStats): HomeRecommendation {
  if (stats.stageCounts.review > 0) {
    return {
      title: '先复习一下旧词',
      description: `你有 ${stats.stageCounts.review} 个待复习词，先把容易忘的词捡回来。`,
      focus: 'review',
    };
  }

  if (stats.stageCounts.new > 0) {
    return {
      title: '今天先认识新词',
      description: `还有 ${stats.stageCounts.new} 个新词没学，先从新内容开始。`,
      focus: 'new',
    };
  }

  if (stats.stageCounts.practicing > 0 || stats.stageCounts.learning > 0) {
    return {
      title: '继续巩固今天的进度',
      description: '有一些词还在学习中，继续练一下会更稳。',
      focus: 'practice',
    };
  }

  return {
    title: '来一轮综合练习',
    description: '当前没有明显积压内容，适合做一轮轻松复习。',
    focus: 'mixed',
  };
}
