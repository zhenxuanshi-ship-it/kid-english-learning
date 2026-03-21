export const categoryLabelMap: Record<string, string> = {
  all: '全部主题',
  animals: '动物',
  fruits: '水果',
  colors: '颜色',
  numbers: '数字',
  family: '家庭',
  school: '学校',
  food: '食物',
  body: '身体',
  clothes: '衣物',
  weather: '天气',
};

export function getCategoryLabel(category: string): string {
  return categoryLabelMap[category] ?? category;
}
