import type { CSSProperties } from 'react';

export type NavTab = 'home' | 'topics' | 'review' | 'report' | 'profile';

interface BottomNavProps {
  current: NavTab;
  onChange: (tab: NavTab) => void;
}

const tabs: Array<{ key: NavTab; label: string; emoji: string }> = [
  { key: 'home', label: '首页', emoji: '🏠' },
  { key: 'topics', label: '主题', emoji: '🎒' },
  { key: 'review', label: '复习', emoji: '🔁' },
  { key: 'report', label: '报告', emoji: '📊' },
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
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 6,
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px 16px 0 0',
    padding: '6px 8px calc(6px + env(safe-area-inset-bottom))',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    maxWidth: 480,
    margin: '0 auto',
  },
  tab: {
    minHeight: 52,
    border: 'none',
    borderRadius: 14,
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
