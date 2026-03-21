import { describe, expect, it } from 'vitest';
import { buildCategoryGalleryItems } from './categoryGallery';

describe('buildCategoryGalleryItems', () => {
  const stats = {
    totalWords: 100,
    learnedWords: 20,
    masteredWords: 5,
    wrongWords: 4,
    accuracyRate: 75,
    stageCounts: { new: 4, learning: 2, practicing: 1, review: 3, mastered: 5 },
    categoryBreakdown: [
      { category: 'animals', total: 15, learned: 6, mastered: 1 },
      { category: 'fruits', total: 10, learned: 2, mastered: 0 },
    ],
  };

  it('builds gallery items with progress and featured word', () => {
    const items = buildCategoryGalleryItems(['animals', 'fruits'], stats);
    expect(items[0].progressPercent).toBe(40);
    expect(items[0].featuredWord).toBeTruthy();
    expect(items[0].featuredChinese).toBeTruthy();
  });
});
