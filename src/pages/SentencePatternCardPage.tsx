import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { SentencePattern } from '../types/sentence';

interface SentencePatternCardPageProps {
  pattern?: SentencePattern;
  onStart: () => void;
  onBack: () => void;
}

export function SentencePatternCardPage({ pattern, onStart, onBack }: SentencePatternCardPageProps) {
  if (!pattern) return null;

  return (
    <motion.div style={styles.wrap} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={styles.card}>
        <div style={styles.badge}>📘 先认识这个句型</div>
        <div style={styles.title}>{pattern.title}</div>
        <div style={styles.desc}>{pattern.description}</div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>它在说什么？</div>
          <div style={styles.note}>先看看这个句子在生活里怎么用，再开始练习。</div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>例句</div>
          <div style={styles.examples}>
            {pattern.examples.map((example) => (
              <div key={example} style={styles.exampleItem}>{example}</div>
            ))}
          </div>
        </div>

        <div style={styles.tip}>小提醒：先大声读一遍，再开始做题，会更容易哦。</div>

        <div style={styles.actions}>
          <button style={styles.primary} onClick={onStart}>开始练这个句型</button>
          <button style={styles.secondary} onClick={onBack}>回句式入口</button>
        </div>
      </div>
    </motion.div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 12 },
  card: {
    background: 'linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)',
    borderRadius: 24,
    padding: 20,
    display: 'grid',
    gap: 14,
    boxShadow: '0 14px 28px rgba(124, 92, 255, 0.10)',
  },
  badge: { fontSize: 13, fontWeight: 900, color: '#7c5cff' },
  title: { fontSize: 28, fontWeight: 900, color: '#384349' },
  desc: { fontSize: 15, fontWeight: 700, color: '#66757b' },
  section: { display: 'grid', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 900, color: '#4d3fb7' },
  note: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  examples: { display: 'grid', gap: 8 },
  exampleItem: {
    borderRadius: 16,
    background: '#fff',
    padding: '12px 14px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
    fontWeight: 800,
    color: '#4a575d',
  },
  tip: {
    borderRadius: 16,
    background: '#f2eeff',
    padding: '12px 14px',
    fontSize: 13,
    fontWeight: 800,
    color: '#5a4bcc',
  },
  actions: { display: 'grid', gap: 10 },
  primary: {
    minHeight: 50,
    border: 'none',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #7c5cff, #9b83ff)',
    color: '#fff',
    fontWeight: 900,
  },
  secondary: {
    minHeight: 46,
    border: '1px solid #ece8ff',
    borderRadius: 16,
    background: '#fff',
    color: '#5a4bcc',
    fontWeight: 800,
  },
};
