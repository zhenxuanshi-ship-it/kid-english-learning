import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { sentencePatterns } from '../data/sentences';
import type { SentencePatternId } from '../types/sentence';

interface SentenceHubPageProps {
  onStartPattern: (patternId: SentencePatternId) => void;
}

export function SentenceHubPage({ onStartPattern }: SentenceHubPageProps) {
  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.hero}>
        <div style={styles.kicker}>句式练习</div>
        <div style={styles.title}>先学小句子</div>
        <div style={styles.desc}>像搭积木一样，把学过的单词连成完整句子。</div>
      </div>

      <div style={styles.list}>
        {sentencePatterns.map((pattern) => (
          <button key={pattern.id} style={styles.card} onClick={() => onStartPattern(pattern.id)}>
            <div style={styles.cardTitle}>{pattern.title}</div>
            <div style={styles.cardDesc}>{pattern.description}</div>
            <div style={styles.examples}>例如：{pattern.examples.join(' / ')}</div>
            <div style={styles.cta}>开始这个句型 →</div>
          </button>
        ))}
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
  cardTitle: { fontSize: 20, fontWeight: 900, color: '#3f4b50' },
  cardDesc: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  examples: { fontSize: 13, fontWeight: 700, color: '#7c5cff' },
  cta: { marginTop: 4, fontSize: 14, fontWeight: 900, color: '#ff6b6b' },
};
