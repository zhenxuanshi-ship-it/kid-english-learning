import type { SentencePatternId } from '../types/sentence';

const categorySentenceMap: Partial<Record<string, SentencePatternId[]>> = {
  animals: ['this_is', 'what_is_this'],
  fruits: ['i_like', 'this_is'],
  colors: ['what_color', 'this_is', 'it_is'],
  numbers: ['i_have', 'what_is_this'],
  family: ['this_is', 'i_have', 'whos_this'],
  school: ['i_have', 'this_is'],
  food: ['i_like', 'what_is_this'],
  body: ['i_have', 'it_is'],
  clothes: ['this_is', 'it_is'],
  weather: ['it_is', 'what_is_this'],
  emotions: ['how_are_you'],
  home: ['this_is', 'where_is'],
  adjectives: ['is_it_or', 'it_is'],
  actions: ['what_can'],
};

export function getSentencePatternIdsForCategory(category?: string): SentencePatternId[] {
  if (!category || category === 'all') return [];
  return categorySentenceMap[category] ?? [];
}
