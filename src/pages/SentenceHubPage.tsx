import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { SentencePattern, SentencePatternId, SentenceProgress } from '../types/sentence';

interface SentenceHubPageProps {
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>;
  orderedPatterns: SentencePattern[];
  recommendedPattern?: SentencePattern;
  continuePattern?: SentencePattern;
  onStartPattern: (patternId: SentencePatternId) => void;
}

export function SentenceHubPage({ progressMap, orderedPatterns, recommendedPattern, continuePattern, onStartPattern }: SentenceHubPageProps) {
  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>
        <div style={styles.kicker}>句式练习</div>
        <div style={styles.title}>先学小句子</div>
        <div style={styles.desc}>像搭积木一样，把学过的单词连成完整句子。</div>
      </div>

      {continuePattern ? (
        <div style={styles.recommendCard}>
          <div style={styles.recommendKicker}>继续上次句型</div>
          <div style={styles.recommendTitle}>{continuePattern.title}</div>
          <button style={styles.recommendButton} onClick={() => onStartPattern(continuePattern.id)}>继续练习</button>
        </div>
      ) : null}

      {recommendedPattern ? (
        <div style={styles.recommendCardSoft}>
          <div style={styles.recommendKicker}>推荐先练</div>
          <div style={styles.recommendTitle}>{recommendedPattern.title}</div>
          <div style={styles.recommendDesc}>优先把还没掌握的句型练熟。</div>
        </div>
      ) : null}

      <div style={styles.list}>
        {orderedPatterns.map((pattern) => {
          const progress = progressMap[pattern.id];
          return (
            <button key={pattern.id} style={styles.card} onClick={() => onStartPattern(pattern.id)}>
              <div style={styles.cardTopRow}>
                <div style={styles.cardTitle}>{pattern.title}</div>
                {progress?.mastered ? <div style={{ ...styles.statusBadge, ...styles.masteredBadge }}>已掌握</div> : progress?.stage === 'review' ? <div style={{ ...styles.statusBadge, ...styles.reviewBadge }}>待复习</div> : progress?.stage === 'learning' ? <div style={styles.statusBadge}>练习中</div> : progress?.seenCount ? <div style={styles.statusBadge}>已练 {progress.seenCount} 次</div> : <div style={styles.statusBadge}>新句型</div>}
              </div>
              <div style={styles.cardDesc}>{pattern.description}</div>
              <div style={styles.examples}>例如：{pattern.examples.join(' / ')}</div>
              <div style={styles.progressLine}>答对 {progress?.correctCount ?? 0} 次 · 答错 {progress?.wrongCount ?? 0} 次</div>
              <div style={styles.cta}>{progress?.seenCount ? '继续这个句型 →' : '开始这个句型 →'}</div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 12 },
  hero: {
    background: 'linear-gradient(135deg, #f7f5ff, #ffffff)',
    borderRadius: 24,
    padding: 18,
    display: 'grid',
    gap: 8,
    boxShadow: '0 12px 24px rgba(122, 92, 255, 0.08)',
  },
  kicker: { fontSize: 13, fontWeight: 900, color: '#7c5cff' },
  title: { fontSize: 26, fontWeight: 900 },
  desc: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  recommendCard: {
    background: 'linear-gradient(135deg, #7c5cff, #9b83ff)',
    borderRadius: 22,
    padding: 16,
    display: 'grid',
    gap: 8,
    color: '#fff',
  },
  recommendCardSoft: {
    background: '#f4f1ff',
    borderRadius: 20,
    padding: 14,
    display: 'grid',
    gap: 6,
  },
  recommendKicker: { fontSize: 12, fontWeight: 900, opacity: 0.9 },
  recommendTitle: { fontSize: 20, fontWeight: 900 },
  recommendDesc: { fontSize: 13, fontWeight: 700, color: '#5a4bcc' },
  recommendButton: {
    minHeight: 44,
    border: 'none',
    borderRadius: 16,
    background: '#fff',
    color: '#5a4bcc',
    fontWeight: 900,
  },
  list: { display: 'grid', gap: 10 },
  card: {
    border: 'none',
    borderRadius: 20,
    background: '#fff',
    boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
    padding: 16,
    display: 'grid',
    gap: 6,
    textAlign: 'left',
  },
  cardTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardTitle: { fontSize: 20, fontWeight: 900, color: '#3f4b50' },
  statusBadge: { padding: '6px 10px', borderRadius: 999, background: '#f2eeff', color: '#5a4bcc', fontSize: 12, fontWeight: 900 },
  masteredBadge: { background: '#e8fff7', color: '#157a6e' },
  reviewBadge: { background: '#fff4df', color: '#9a6500' },
  cardDesc: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  examples: { fontSize: 13, fontWeight: 700, color: '#7c5cff' },
  progressLine: { fontSize: 12, fontWeight: 800, color: '#7b8890' },
  cta: { marginTop: 4, fontSize: 14, fontWeight: 900, color: '#ff6b6b' },
};
