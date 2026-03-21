import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { sentencePatterns } from '../data/sentences';
import type { SentencePatternId, SentenceProgress } from '../types/sentence';

interface SentenceHubPageProps {
  progressMap: Partial<Record<SentencePatternId, SentenceProgress>>;
  onStartPattern: (patternId: SentencePatternId) => void;
}

export function SentenceHubPage({ progressMap, onStartPattern }: SentenceHubPageProps) {
  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>
        <div style={styles.kicker}>句式练习</div>
        <div style={styles.title}>先学小句子</div>
        <div style={styles.desc}>像搭积木一样，把学过的单词连成完整句子。</div>
      </div>

      <div style={styles.list}>
        {sentencePatterns.map((pattern) => {
          const progress = progressMap[pattern.id];
          return (
            <button key={pattern.id} style={styles.card} onClick={() => onStartPattern(pattern.id)}>
              <div style={styles.cardTopRow}>
                <div style={styles.cardTitle}>{pattern.title}</div>
                {progress?.mastered ? <div style={{ ...styles.statusBadge, ...styles.masteredBadge }}>已掌握</div> : progress?.seenCount ? <div style={styles.statusBadge}>已练 {progress.seenCount} 次</div> : null}
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
  cardDesc: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  examples: { fontSize: 13, fontWeight: 700, color: '#7c5cff' },
  progressLine: { fontSize: 12, fontWeight: 800, color: '#7b8890' },
  cta: { marginTop: 4, fontSize: 14, fontWeight: 900, color: '#ff6b6b' },
};
