import type { CSSProperties } from 'react';

interface HeaderBarProps {
  stars: number;
  modeLabel: string;
  totalStars: number;
}

export function HeaderBar({ stars, modeLabel, totalStars }: HeaderBarProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.bubble}>
        <div style={styles.value}>⭐ {stars}</div>
        <div style={styles.label}>本轮星星</div>
      </div>
      <div style={{ ...styles.bubble, ...styles.centerBubble }}>
        <div style={styles.modePill}>当前模式</div>
        <div style={styles.modeText}>{modeLabel}</div>
      </div>
      <div style={styles.bubble}>
        <div style={styles.value}>🌟 {totalStars}</div>
        <div style={styles.label}>累计星星</div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr 1fr',
    gap: 10,
    alignItems: 'stretch',
  },
  bubble: {
    padding: '12px 10px',
    borderRadius: 22,
    background: 'linear-gradient(135deg, #ffffff, #fff5f5)',
    boxShadow: '0 10px 28px rgba(255, 107, 107, 0.12)',
    textAlign: 'center',
    border: '2px solid rgba(255,255,255,0.8)',
  },
  centerBubble: {
    background: 'linear-gradient(135deg, #ff6b6b, #ffa69e)',
    color: '#fff',
  },
  value: {
    fontWeight: 900,
    fontSize: 18,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.75,
    fontWeight: 700,
  },
  modePill: {
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.9,
  },
  modeText: {
    fontSize: 17,
    fontWeight: 900,
    marginTop: 4,
  },
};
