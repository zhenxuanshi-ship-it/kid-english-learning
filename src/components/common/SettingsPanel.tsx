import type { CSSProperties } from 'react';
import { getCategoryLabel } from '../../lib/category';

interface SettingsPanelProps {
  roundSize: number;
  selectedCategory: string;
  categories: string[];
  autoPlaySound: boolean;
  soundEnabled: boolean;
  onRoundSizeChange: (size: number) => void;
  onCategoryChange: (category: string) => void;
  onToggleAutoPlaySound: () => void;
  onToggleSoundEnabled: () => void;
}

export function SettingsPanel({
  roundSize,
  selectedCategory,
  categories,
  autoPlaySound,
  soundEnabled,
  onRoundSizeChange,
  onCategoryChange,
  onToggleAutoPlaySound,
  onToggleSoundEnabled,
}: SettingsPanelProps) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>⚙️ 学习设置</div>

      <div style={styles.section}>
        <div style={styles.label}>每轮题数</div>
        <div style={styles.chips}>
          {[5, 8, 10].map((size) => (
            <button
              key={size}
              style={{ ...styles.chip, ...(roundSize === size ? styles.chipActive : {}) }}
              onClick={() => onRoundSizeChange(size)}
            >
              {size} 题
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>主题分类</div>
        <select style={styles.select} value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">全部主题</option>
          {categories.map((category) => (
            <option key={category} value={category}>{getCategoryLabel(category)}</option>
          ))}
        </select>
      </div>

      <div style={styles.toggleRow}>
        <button style={{ ...styles.toggle, ...(soundEnabled ? styles.toggleOn : {}) }} onClick={onToggleSoundEnabled}>
          {soundEnabled ? '🔊 音效已开启' : '🔇 音效已关闭'}
        </button>
        <button style={{ ...styles.toggle, ...(autoPlaySound ? styles.toggleOn : {}) }} onClick={onToggleAutoPlaySound}>
          {autoPlaySound ? '▶️ 自动发音开' : '⏸️ 自动发音关'}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
    display: 'grid',
    gap: 16,
  },
  title: { fontWeight: 900, fontSize: 18 },
  section: { display: 'grid', gap: 10 },
  label: { fontSize: 14, color: '#6b7a80', fontWeight: 800 },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip: {
    minHeight: 40,
    padding: '0 14px',
    border: 'none',
    borderRadius: 999,
    background: '#f3f7f8',
    fontWeight: 800,
  },
  chipActive: {
    background: '#4ecdc4',
    color: '#fff',
  },
  select: {
    minHeight: 44,
    borderRadius: 14,
    border: '2px solid #e7eef0',
    padding: '0 12px',
    fontSize: 15,
    background: '#fff',
  },
  toggleRow: { display: 'grid', gap: 10 },
  toggle: {
    minHeight: 46,
    border: 'none',
    borderRadius: 16,
    background: '#f7f9fc',
    fontWeight: 800,
  },
  toggleOn: {
    background: '#fff2b8',
    color: '#7d5a00',
  },
};
