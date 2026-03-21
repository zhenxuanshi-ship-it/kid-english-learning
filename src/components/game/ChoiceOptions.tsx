import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface ChoiceOptionsProps {
  options: string[];
  selected?: string;
  answer: string;
  lockSelection?: boolean;
  onSelect: (option: string) => void;
}

export function ChoiceOptions({ options, selected, answer, lockSelection = false, onSelect }: ChoiceOptionsProps) {
  return (
    <div style={styles.list}>
      {options.map((option, index) => {
        const isSelected = selected === option;
        const isCorrect = lockSelection && option === answer;
        return (
          <motion.button
            key={option}
            style={{
              ...styles.item,
              ...(isCorrect ? styles.correct : {}),
              ...(isSelected && !isCorrect ? styles.wrong : {}),
            }}
            onClick={() => onSelect(option)}
            disabled={lockSelection}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span style={styles.optionBadge}>{String.fromCharCode(65 + index)}</span>
            <span>{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  list: { display: 'grid', gap: 12 },
  item: {
    minHeight: 62,
    borderRadius: 22,
    border: 'none',
    background: 'linear-gradient(180deg, #ffffff, #fffaf2)',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
    fontSize: 18,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 16px',
    textAlign: 'left',
  },
  optionBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: '#ffe66d',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    color: '#7d5a00',
    fontSize: 14,
  },
  correct: {
    background: 'linear-gradient(135deg, #4ecdc4, #74e3d7)',
    color: '#fff',
  },
  wrong: {
    background: 'linear-gradient(135deg, #ff7675, #ffa3a1)',
    color: '#fff',
  },
};
