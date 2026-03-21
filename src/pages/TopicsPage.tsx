import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { CategoryGallery } from '../components/common/CategoryGallery';
import type { CategoryGalleryItem } from '../lib/categoryGallery';

interface TopicsPageProps {
  items: CategoryGalleryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onStartTopic: (category: string) => void;
  onOpenSentencePractice: () => void;
}

export function TopicsPage({ items, selectedCategory, onSelectCategory, onStartTopic, onOpenSentencePractice }: TopicsPageProps) {
  const selectedItem = items.find((item) => item.category === selectedCategory) ?? items[0];

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.switchCard}>
        <div>
          <div style={styles.switchTitle}>🧩 句式练习</div>
          <div style={styles.switchDesc}>先练小句子，再把单词连起来用。</div>
        </div>
        <button style={styles.switchButton} onClick={onOpenSentencePractice}>进入句式练习</button>
      </div>
      {selectedItem ? (
        <div style={styles.hero}>
          <div style={styles.kicker}>今日推荐主题</div>
          <div style={styles.title}>{selectedItem.label}</div>
          <div style={styles.desc}>{selectedItem.tagline}</div>
          <div style={styles.recommendation}>{selectedItem.recommendation}</div>
          <div style={styles.featuredLine}>推荐起点：{selectedItem.featuredChinese} · {selectedItem.featuredWord}</div>
          <button style={styles.primary} onClick={() => onStartTopic(selectedItem.category)}>开始这个主题</button>
        </div>
      ) : null}
      <CategoryGallery items={items} selectedCategory={selectedCategory} onSelect={onSelectCategory} />
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 14 },
  switchCard: {
    background: 'linear-gradient(135deg, #f7f5ff, #ffffff)',
    borderRadius: 22,
    padding: 16,
    display: 'grid',
    gap: 10,
    boxShadow: '0 10px 22px rgba(124, 92, 255, 0.08)',
  },
  switchTitle: { fontSize: 18, fontWeight: 900, color: '#433880' },
  switchDesc: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  switchButton: {
    minHeight: 46,
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #7c5cff, #9b83ff)',
    color: '#fff',
    fontWeight: 900,
  },
  hero: {
    background: 'linear-gradient(135deg, #fff8f5, #ffffff)',
    borderRadius: 28,
    padding: 20,
    display: 'grid',
    gap: 8,
    boxShadow: '0 14px 28px rgba(255,107,107,0.10)',
    border: '1px solid rgba(255, 107, 107, 0.08)',
  },
  kicker: { fontSize: 13, fontWeight: 900, color: '#ff8e7b' },
  title: { fontSize: 28, fontWeight: 900 },
  desc: { fontSize: 16, fontWeight: 800, color: '#56656b' },
  recommendation: { fontSize: 14, fontWeight: 700, color: '#6b7a80' },
  featuredLine: { fontSize: 13, fontWeight: 800, color: '#ff8e7b' },
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
