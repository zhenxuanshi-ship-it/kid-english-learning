import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { getChildrenSummary } from '../lib/supabase/children';
import type { Database } from '../lib/supabase/database.types';

type ChildSummary = Database['public']['Views']['children_summary']['Row'];

interface ReportPageProps {
  children: Array<{ id: string; name: string; avatar_emoji: string | null }>;
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
}

export function ReportPage({ children, selectedChildId, onSelectChild }: ReportPageProps) {
  const [summary, setSummary] = useState<ChildSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getChildrenSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const current = summary.find((s) => s.child_id === selectedChildId);

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

      {/* 标题 */}
      <div style={styles.header}>
        <span style={styles.headerEmoji}>📊</span>
        <span style={styles.headerTitle}>家长报告</span>
      </div>

      {/* 孩子选择 */}
      {children.length > 0 && (
        <div style={styles.selectorRow}>
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              style={{
                ...styles.chip,
                ...(selectedChildId === child.id ? styles.chipActive : {}),
              }}
            >
              {child.avatar_emoji ?? '👦'} {child.name}
            </button>
          ))}
        </div>
      )}

      {loading && <div style={styles.loading}>加载中...</div>}

      {!loading && children.length === 0 && (
        <div style={styles.empty}>请先在「我的」中添加孩子</div>
      )}

      {!loading && current && (
        <>
          {/* 概览卡片 */}
          <div style={styles.overviewCard}>
            <div style={styles.childName}>
              {current.avatar_emoji ?? '👦'} {current.child_name}
            </div>
            <div style={styles.overviewGrid}>
              <StatItem label="🔥 连续学习" value={`${current.streak_days} 天`} color="#ff6b6b" />
              <StatItem label="📖 已学单词" value={`${current.words_practiced ?? 0} 个`} color="#4ecdc4" />
              <StatItem label="⭐ 掌握单词" value={`${current.words_mastered ?? 0} 个`} color="#ffd700" />
              <StatItem label="🎯 句型练习" value={`${current.patterns_practiced ?? 0} 个`} color="#9b7fd4" />
            </div>
          </div>

          {/* 今日数据 */}
          <div style={styles.todayCard}>
            <div style={styles.todayTitle}>📅 今日进度</div>
            <div style={styles.todayGrid}>
              <div style={styles.todayStat}>
                <div style={styles.todayNum}>{current.words_today ?? 0}</div>
                <div style={styles.todayLabel}>个单词已练</div>
              </div>
              <div style={styles.todayDivider} />
              <div style={styles.todayStat}>
                <div style={{ ...styles.todayNum, color: '#4ecdc4' }}>{current.correct_today ?? 0}</div>
                <div style={styles.todayLabel}>个正确</div>
              </div>
            </div>
          </div>

          {/* 本周活跃 */}
          <div style={styles.weekCard}>
            <div style={styles.weekTitle}>📆 本周活跃度</div>
            <div style={styles.weekRow}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const active = (current.sessions_this_week ?? 0) >= day;
                const labels = ['一', '二', '三', '四', '五', '六', '日'];
                return (
                  <div key={day} style={styles.dayCol}>
                    <div style={{ ...styles.dayDot, background: active ? '#4ecdc4' : '#e2e8f0' }} />
                    <div style={styles.dayLabel}>周{labels[day - 1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 掌握度进度条 */}
          {current.words_practiced !== null && current.words_practiced > 0 && (
            <div style={styles.progressCard}>
              <div style={styles.progressTitle}>🏆 掌握进度</div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.min(100, ((current.words_mastered ?? 0) / (current.words_practiced ?? 1)) * 100)}%`,
                  }}
                />
              </div>
              <div style={styles.progressLabel}>
                {current.words_mastered ?? 0} / {current.words_practiced} 单词已掌握
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={styles.statItem}>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 16 },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 0',
  },
  headerEmoji: { fontSize: 24 },
  headerTitle: { fontSize: 22, fontWeight: 900, color: '#2d3748' },
  selectorRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '8px 14px',
    borderRadius: 99,
    border: '2px solid #e2e8f0',
    background: '#fff',
    fontSize: 14,
    fontWeight: 700,
    color: '#4a5568',
    cursor: 'pointer',
  },
  chipActive: {
    border: '2px solid #ff6b6b',
    background: '#fff4ef',
    color: '#ff6b6b',
  },
  loading: { textAlign: 'center', color: '#a0aec0', padding: 40 },
  empty: { textAlign: 'center', color: '#a0aec0', padding: 40, fontSize: 15 },
  overviewCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 16,
  },
  childName: { fontSize: 18, fontWeight: 900, color: '#2d3748', textAlign: 'center' },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  statItem: {
    background: '#f7fafc',
    borderRadius: 14,
    padding: '12px 10px',
    textAlign: 'center',
    display: 'grid',
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: 900 },
  statLabel: { fontSize: 12, color: '#718096', fontWeight: 600 },
  todayCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
  },
  todayTitle: { fontSize: 16, fontWeight: 800, color: '#384349', marginBottom: 12 },
  todayGrid: { display: 'flex', alignItems: 'center', gap: 16 },
  todayDivider: { width: 1, height: 40, background: '#e2e8f0' },
  todayStat: { flex: 1, textAlign: 'center' },
  todayNum: { fontSize: 32, fontWeight: 900, color: '#ff6b6b' },
  todayLabel: { fontSize: 13, color: '#718096', fontWeight: 600, marginTop: 2 },
  weekCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
  },
  weekTitle: { fontSize: 16, fontWeight: 800, color: '#384349', marginBottom: 14 },
  weekRow: { display: 'flex', justifyContent: 'space-between' },
  dayCol: { display: 'grid', gap: 6, alignItems: 'center' },
  dayDot: { width: 32, height: 32, borderRadius: '50%' },
  dayLabel: { fontSize: 12, color: '#718096', fontWeight: 600, textAlign: 'center' },
  progressCard: {
    background: '#fff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 8px 18px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 10,
  },
  progressTitle: { fontSize: 16, fontWeight: 800, color: '#384349' },
  progressBar: {
    height: 12,
    borderRadius: 99,
    background: '#edf2f7',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 99,
    background: 'linear-gradient(90deg, #ff6b6b, #ffa07a)',
    transition: 'width 0.6s ease',
  },
  progressLabel: { fontSize: 13, color: '#718096', fontWeight: 600, textAlign: 'right' },
};
