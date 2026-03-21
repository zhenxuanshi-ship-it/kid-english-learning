import type { CSSProperties } from 'react';
import type { GameMode } from '../types/question';

interface HomePageProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
  totalStars: number;
}

const modes: Array<{ value: GameMode; label: string; emoji: string }> = [
  { value: 'e2c', label: '英译中选择', emoji: '🌈' },
  { value: 'c2e', label: '中译英拼写', emoji: '✏️' },
  { value: 'spell_blank', label: '留空补全', emoji: '🧩' },
];

export function HomePage({ mode, onModeChange, onStart, totalStars }: HomePageProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.hero}>儿童英语单词学习</div>
      <div style={styles.sub}>一轮 5 题，轻轻松松学单词 ⭐ 累计 {totalStars}</div>
      <div style={styles.grid}>
        {modes.map((item) => (
          <button
            key={item.value}
            style={{ ...styles.modeCard, ...(mode === item.value ? styles.active : {}) }}
            onClick={() => onModeChange(item.value)}
          >
            <div style={styles.emoji}>{item.emoji}</div>
            <div>{item.label}</div>
          </button>
        ))}
      </div>
      <button style={styles.start} onClick={onStart}>开始学习</button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 18 },
  hero: { fontSize: 36, fontWeight: 900, textAlign: 'center' },
  sub: { textAlign: 'center', color: '#636e72', fontSize: 18 },
  grid: { display: 'grid', gap: 14 },
  modeCard: {
    minHeight: 84,
    border: 'none',
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    fontSize: 18,
    fontWeight: 800,
    cursor: 'pointer',
  },
  active: {
    outline: '3px solid #4ecdc4',
    transform: 'translateY(-2px)',
  },
  emoji: { fontSize: 26, marginBottom: 6 },
  start: {
    minHeight: 58,
    border: 'none',
    borderRadius: 18,
    background: '#ff6b6b',
    color: '#fff',
    fontSize: 20,
    fontWeight: 900,
    cursor: 'pointer',
  },
};
