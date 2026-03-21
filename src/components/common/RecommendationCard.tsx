import type { CSSProperties } from 'react';
import type { HomeRecommendation } from '../../lib/recommendation';

interface RecommendationCardProps {
  recommendation: HomeRecommendation;
}

const focusStyleMap: Record<HomeRecommendation['focus'], { bg: string; emoji: string }> = {
  new: { bg: '#FFF6D8', emoji: '🆕' },
  review: { bg: '#F2EFFF', emoji: '🔁' },
  practice: { bg: '#E8FFFB', emoji: '✏️' },
  mixed: { bg: '#FFF0EE', emoji: '🌈' },
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const meta = focusStyleMap[recommendation.focus];

  return (
    <div style={{ ...styles.card, background: meta.bg }}>
      <div style={styles.row}>
        <div style={styles.emoji}>{meta.emoji}</div>
        <div>
          <div style={styles.title}>{recommendation.title}</div>
          <div style={styles.desc}>{recommendation.description}</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 12px 28px rgba(0,0,0,0.06)',
  },
  row: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  emoji: {
    width: 48,
    height: 48,
    borderRadius: 999,
    background: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: 24,
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 900,
    color: '#2d3436',
  },
  desc: {
    marginTop: 4,
    color: '#627277',
    fontWeight: 700,
    fontSize: 14,
  },
};
