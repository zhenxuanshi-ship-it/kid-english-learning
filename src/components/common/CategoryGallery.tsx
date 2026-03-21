import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { CategoryGalleryItem } from '../../lib/categoryGallery';
import { WordVisual } from './WordVisual';

interface CategoryGalleryProps {
  items: CategoryGalleryItem[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const categoryVisualMap: Record<string, { emoji: string; bg: string }> = {
  animals: { emoji: '🐾', bg: '#FFF4E6' },
  fruits: { emoji: '🍓', bg: '#FFF1F3' },
  colors: { emoji: '🎨', bg: '#F5F3FF' },
  numbers: { emoji: '🔢', bg: '#EEF7FF' },
  family: { emoji: '🏠', bg: '#FFF8E8' },
  school: { emoji: '📚', bg: '#F1F8FF' },
  food: { emoji: '🍽️', bg: '#FFF7F0' },
  body: { emoji: '🧍', bg: '#FFF6F4' },
  clothes: { emoji: '👕', bg: '#F8F5FF' },
  weather: { emoji: '🌤️', bg: '#F0FBFF' },
};

export function CategoryGallery({ items, selectedCategory, onSelect }: CategoryGalleryProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.title}>🎒 主题入口</div>
        <button
          style={{ ...styles.allButton, ...(selectedCategory === 'all' ? styles.allButtonActive : {}) }}
          onClick={() => onSelect('all')}
        >
          全部主题
        </button>
      </div>

      <div style={styles.grid}>
        {items.map((item, index) => {
          const meta = categoryVisualMap[item.category] ?? { emoji: '📘', bg: '#F7F9FC' };
          const active = selectedCategory === item.category;
          return (
            <motion.button
              key={item.category}
              style={{ ...styles.card, background: meta.bg, ...(active ? styles.activeCard : {}) }}
              onClick={() => onSelect(item.category)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div style={styles.cover}>
                {item.featuredVisual ? <WordVisual word={item.featuredVisual} size="sm" /> : <div style={styles.emoji}>{meta.emoji}</div>}
                <div style={styles.tagline}>{item.tagline}</div>
              </div>
              <div style={styles.label}>{item.label}</div>
              <div style={styles.recommendation}>{item.recommendation}</div>
              <div style={styles.progressText}>已学 {item.learned}/{item.total}</div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${item.progressPercent}%` }} />
              </div>
              <div style={styles.featuredWord}>{item.featuredChinese} · {item.featuredWord}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    background: '#fff',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    display: 'grid',
    gap: 14,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  title: { fontWeight: 900, fontSize: 18 },
  allButton: {
    minHeight: 38,
    padding: '0 12px',
    border: 'none',
    borderRadius: 999,
    background: '#f3f7f8',
    fontWeight: 800,
    cursor: 'pointer',
  },
  allButtonActive: {
    background: '#4ecdc4',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10,
  },
  card: {
    border: 'none',
    borderRadius: 20,
    padding: '12px',
    display: 'grid',
    gap: 8,
    justifyItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  activeCard: {
    outline: '3px solid #ff8e7b',
    transform: 'translateY(-1px)',
  },
  cover: {
    width: '100%',
    minHeight: 78,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.66)',
    display: 'grid',
    placeItems: 'center',
    gap: 4,
    padding: '10px 8px',
  },
  emoji: { fontSize: 30 },
  tagline: { fontSize: 12, fontWeight: 800, color: '#6b7a80' },
  label: { fontWeight: 800, color: '#435055' },
  recommendation: { fontSize: 12, fontWeight: 700, color: '#5f6d73' },
  progressText: { fontSize: 12, fontWeight: 800, color: '#617076' },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.8)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(135deg, #4ecdc4, #73ddd3)',
  },
  featuredWord: { fontSize: 12, fontWeight: 700, color: '#6b7a80' },
};
