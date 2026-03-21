import type { CSSProperties } from 'react';
import type { NextTaskRecommendation } from '../../lib/nextTask';

interface NextTaskBannerProps {
  recommendation: NextTaskRecommendation;
  highlight?: boolean;
}

export function NextTaskBanner({ recommendation, highlight = false }: NextTaskBannerProps) {
  return (
    <div style={{ ...styles.card, ...(highlight ? styles.cardHighlight : {}) }}>
      <div style={styles.title}>➡️ 下一项推荐</div>
      <div style={styles.message}>{recommendation.message}</div>
      {recommendation.nextLabel ? <div style={styles.tag}>{recommendation.nextLabel}</div> : null}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: 'linear-gradient(135deg, #fff7f3, #ffffff)',
    borderRadius: 22,
    padding: 16,
    boxShadow: '0 10px 24px rgba(255, 107, 107, 0.08)',
    display: 'grid',
    gap: 8,
  },
  cardHighlight: {
    boxShadow: '0 0 0 3px rgba(255, 230, 109, 0.35), 0 16px 30px rgba(255, 107, 107, 0.14)',
    transform: 'translateY(-1px)',
  },
  title: { fontWeight: 900, fontSize: 16 },
  message: { color: '#5f6d73', fontWeight: 700, fontSize: 14 },
  tag: {
    justifySelf: 'start',
    padding: '6px 10px',
    borderRadius: 999,
    background: '#FFE66D',
    color: '#7d5a00',
    fontWeight: 900,
    fontSize: 13,
  },
};
