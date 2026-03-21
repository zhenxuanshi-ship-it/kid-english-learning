import type { CSSProperties } from 'react';

export type NavTab = 'home' | 'topics' | 'review' | 'profile';

interface BottomNavProps {
  current: NavTab;
  onChange: (tab: NavTab) => void;
}

const tabs: Array<{ key: NavTab; label: string; emoji: string }> = [
  { key: 'home', label: '首页', emoji: '🏠' },
  { key: 'topics', label: '主题', emoji: '🎒' },
  { key: 'review', label: '复习', emoji: '🔁' },
  { key: 'profile', label: '我的', emoji: '⭐' },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <div style={styles.bar}>
      {tabs.map((tab) => {
        const active = current === tab.key;
        return (
          <button key={tab.key} style={{ ...styles.tab, ...(active ? styles.tabActive : {}) }} onClick={() => onChange(tab.key)}>
            <span style={styles.emoji}>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  bar: {
    position: 'sticky',
    bottom: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 8,
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(12px)',
    borderRadius: 20,
    padding: 10,
    boxShadow: '0 12px 30px rgba(0,0,0,0.10)',
  },
  tab: {
    minHeight: 58,
    border: 'none',
    borderRadius: 16,
    background: 'transparent',
    display: 'grid',
    gap: 2,
    placeItems: 'center',
    fontWeight: 800,
    color: '#708086',
  },
  tabActive: {
    background: '#fff4ef',
    color: '#ff6b6b',
  },
  emoji: { fontSize: 20 },
};
