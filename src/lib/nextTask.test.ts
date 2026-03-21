import { describe, expect, it } from 'vitest';
import { getNextTaskRecommendation } from './nextTask';

describe('getNextTaskRecommendation', () => {
  const plan = {
    title: '今日学习任务',
    summary: 'summary',
    tasks: [
      { label: '先复习旧词', count: 3, mode: 'e2c' as const, kind: 'review' as const },
      { label: '认识新词', count: 4, mode: 'e2c' as const, kind: 'new' as const },
      { label: '继续拼写练习', count: 2, mode: 'c2e' as const, kind: 'practice' as const },
    ],
  };

  it('recommends the first unfinished task', () => {
    const result = getNextTaskRecommendation(plan, ['review']);
    expect(result.nextLabel).toBe('认识新词');
  });

  it('returns completed message when all tasks are done', () => {
    const result = getNextTaskRecommendation(plan, ['review', 'new', 'practice']);
    expect(result.nextIndex).toBeNull();
  });
});
