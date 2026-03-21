import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { getCategoryLabel } from '../../lib/category';

interface CategoryGalleryProps {
  categories: string[];
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

export function CategoryGallery({ categories, selectedCategory, onSelect }: CategoryGalleryProps) {
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
        {categories.map((category, index) => {
          const meta = categoryVisualMap[category] ?? { emoji: '📘', bg: '#F7F9FC' };
          const active = selectedCategory === category;
          return (
            <motion.button
              key={category}
              style={{ ...styles.card, background: meta.bg, ...(active ? styles.activeCard : {}) }}
              onClick={() => onSelect(category)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div style={styles.emoji}>{meta.emoji}</div>
              <div style={styles.label}>{getCategoryLabel(category)}</div>
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
    padding: '16px 12px',
    display: 'grid',
    gap: 8,
    justifyItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
  },
  activeCard: {
    outline: '3px solid #ff8e7b',
    transform: 'translateY(-1px)',
  },
  emoji: { fontSize: 30 },
  label: { fontWeight: 800, color: '#435055' },
};
