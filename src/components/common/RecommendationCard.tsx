import type { CSSProperties } from 'react';
import { getCategoryLabel } from '../../lib/category';
import type { HomeRecommendation } from '../../lib/recommendation';

interface RecommendationCardProps {
  recommendation: HomeRecommendation;
  onApplyCategory?: (category: string) => void;
}

const focusStyleMap: Record<HomeRecommendation['focus'], { bg: string; emoji: string }> = {
  new: { bg: '#FFF6D8', emoji: '🆕' },
  review: { bg: '#F2EFFF', emoji: '🔁' },
  practice: { bg: '#E8FFFB', emoji: '✏️' },
  mixed: { bg: '#FFF0EE', emoji: '🌈' },
};

export function RecommendationCard({ recommendation, onApplyCategory }: RecommendationCardProps) {
  const meta = focusStyleMap[recommendation.focus];

  return (
    <div style={{ ...styles.card, background: meta.bg }}>
      <div style={styles.row}>
        <div style={styles.emoji}>{meta.emoji}</div>
        <div style={styles.content}>
          <div style={styles.title}>{recommendation.title}</div>
          <div style={styles.desc}>{recommendation.description}</div>
          {recommendation.suggestedCategory ? (
            <div style={styles.tagRow}>
              <span style={styles.tag}>推荐主题：{getCategoryLabel(recommendation.suggestedCategory)}</span>
              {onApplyCategory ? (
                <button style={styles.action} onClick={() => onApplyCategory(recommendation.suggestedCategory!)}>
                  切到这个主题
                </button>
              ) : null}
            </div>
          ) : null}
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
  content: { display: 'grid', gap: 4 },
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
  tagRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    padding: '6px 10px',
    borderRadius: 999,
    background: '#FFFFFF',
    color: '#55656A',
    fontSize: 12,
    fontWeight: 800,
  },
  action: {
    minHeight: 34,
    padding: '0 10px',
    border: 'none',
    borderRadius: 999,
    background: '#FF6B6B',
    color: '#fff',
    fontWeight: 900,
    cursor: 'pointer',
  },
};
