import type { ReviewWordItem } from './review';

export interface ReviewSummary {
  total: number;
  highPriorityCount: number;
  nextWordLabel?: string;
  message: string;
}

export function buildReviewSummary(items: ReviewWordItem[]): ReviewSummary {
  const highPriorityCount = items.filter((item) => item.priorityLabel === 'high').length;
  const nextWordLabel = items[0] ? `${items[0].chinese} · ${items[0].english}` : undefined;

  if (items.length === 0) {
    return {
      total: 0,
      highPriorityCount: 0,
      nextWordLabel: undefined,
      message: '今天暂时没有高优先复习词，可以轻松继续新内容。',
    };
  }

  return {
    total: items.length,
    highPriorityCount,
    nextWordLabel,
    message: highPriorityCount > 0
      ? `今天有 ${highPriorityCount} 个高优先复习词，建议先捡回最容易忘的内容。`
      : `今天有 ${items.length} 个复习词，做一轮就会更稳。`,
  };
}
