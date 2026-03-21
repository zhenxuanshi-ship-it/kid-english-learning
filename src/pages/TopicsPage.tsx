import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { CategoryGallery } from '../components/common/CategoryGallery';
import type { CategoryGalleryItem } from '../lib/categoryGallery';

interface TopicsPageProps {
  items: CategoryGalleryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onStartTopic: () => void;
}

export function TopicsPage({ items, selectedCategory, onSelectCategory, onStartTopic }: TopicsPageProps) {
  const selectedItem = items.find((item) => item.category === selectedCategory) ?? items[0];

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {selectedItem ? (
        <div style={styles.hero}>
          <div style={styles.kicker}>今日推荐主题</div>
          <div style={styles.title}>{selectedItem.label}</div>
          <div style={styles.desc}>{selectedItem.tagline}</div>
          <div style={styles.recommendation}>{selectedItem.recommendation}</div>
          <button style={styles.primary} onClick={onStartTopic}>开始这个主题</button>
        </div>
      ) : null}
      <CategoryGallery items={items} selectedCategory={selectedCategory} onSelect={onSelectCategory} />
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 16 },
  hero: {
    background: 'linear-gradient(135deg, #fff7f3, #ffffff)',
    borderRadius: 28,
    padding: 20,
    display: 'grid',
    gap: 8,
    boxShadow: '0 16px 30px rgba(255,107,107,0.12)',
  },
  kicker: { fontSize: 13, fontWeight: 900, color: '#ff8e7b' },
  title: { fontSize: 28, fontWeight: 900 },
  desc: { fontSize: 16, fontWeight: 800, color: '#56656b' },
  recommendation: { fontSize: 14, fontWeight: 700, color: '#6b7a80' },
  primary: {
    marginTop: 6,
    minHeight: 52,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
    fontSize: 18,
  },
};
