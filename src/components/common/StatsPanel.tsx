import type { CSSProperties } from 'react';
import { getCategoryLabel } from '../../lib/category';
import type { LearningStats } from '../../lib/stats';

interface StatsPanelProps {
  stats: LearningStats;
  compact?: boolean;
}

export function StatsPanel({ stats, compact = false }: StatsPanelProps) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>📊 学习统计</div>

      <div style={styles.grid}>
        <div style={styles.item}>
          <strong>{stats.learnedWords}</strong>
          <span>已学单词</span>
        </div>
        <div style={styles.item}>
          <strong>{stats.masteredWords}</strong>
          <span>已掌握</span>
        </div>
        <div style={styles.item}>
          <strong>{stats.wrongWords}</strong>
          <span>出错过</span>
        </div>
        <div style={styles.item}>
          <strong>{stats.accuracyRate}%</strong>
          <span>正确率</span>
        </div>
      </div>

      {!compact ? (
        <div style={styles.breakdown}>
          <div style={styles.subtitle}>分类进度</div>
          <div style={styles.list}>
            {stats.categoryBreakdown.map((item) => {
              const percent = item.total > 0 ? Math.round((item.learned / item.total) * 100) : 0;
              return (
                <div key={item.category} style={styles.row}>
                  <div style={styles.rowHead}>
                    <span>{getCategoryLabel(item.category)}</span>
                    <span>{item.learned}/{item.total}</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
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
  subtitle: { fontWeight: 800, color: '#6b7a80' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 10,
  },
  item: {
    background: '#f7f9fc',
    borderRadius: 18,
    padding: '14px 12px',
    display: 'grid',
    gap: 4,
    textAlign: 'center',
  },
  breakdown: { display: 'grid', gap: 12 },
  list: { display: 'grid', gap: 10 },
  row: { display: 'grid', gap: 6 },
  rowHead: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
    fontWeight: 700,
    color: '#516066',
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    background: '#eef3f5',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(135deg, #4ecdc4, #73ddd3)',
  },
};
