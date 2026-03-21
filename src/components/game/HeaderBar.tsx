import type { CSSProperties } from 'react';

interface HeaderBarProps {
  stars: number;
  modeLabel: string;
  totalStars: number;
}

export function HeaderBar({ stars, modeLabel, totalStars }: HeaderBarProps) {
  return (
    <div style={styles.wrap}>
      <div>⭐ 本轮 {stars}</div>
      <div>{modeLabel}</div>
      <div>🌟 累计 {totalStars}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: '14px 18px',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8fab)',
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 10px 24px rgba(255, 107, 107, 0.25)',
  },
};
