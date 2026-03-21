import type { CSSProperties, ReactNode } from 'react';

interface WordCardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  status?: 'correct' | 'wrong' | null;
}

export function WordCard({ title, subtitle, children, status = null }: WordCardProps) {
  return (
    <div style={{ ...styles.card, ...(status ? styles[status] : {}) }}>
      <div style={styles.icon}>🧠</div>
      <div style={styles.title}>{title}</div>
      {subtitle ? <div style={styles.subtitle}>{subtitle}</div> : null}
      {children}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
    textAlign: 'center',
    minHeight: 240,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
    border: '3px solid transparent',
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 18,
    color: '#636e72',
  },
  correct: {
    borderColor: '#4ecdc4',
    transform: 'translateY(-2px)',
  },
  wrong: {
    borderColor: '#ff7675',
  },
};
