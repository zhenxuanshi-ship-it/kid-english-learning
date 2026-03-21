import type { CSSProperties } from 'react';

interface ChoiceOptionsProps {
  options: string[];
  selected?: string;
  answer: string;
  onSelect: (option: string) => void;
}

export function ChoiceOptions({ options, selected, answer, onSelect }: ChoiceOptionsProps) {
  return (
    <div style={styles.list}>
      {options.map((option) => {
        const isSelected = selected === option;
        const isCorrect = selected && option === answer;
        return (
          <button
            key={option}
            style={{
              ...styles.item,
              ...(isCorrect ? styles.correct : {}),
              ...(isSelected && !isCorrect ? styles.wrong : {}),
            }}
            onClick={() => onSelect(option)}
            disabled={Boolean(selected)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  list: { display: 'grid', gap: 12 },
  item: {
    minHeight: 56,
    borderRadius: 18,
    border: 'none',
    background: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },
  correct: {
    background: '#4ecdc4',
    color: '#fff',
  },
  wrong: {
    background: '#ff7675',
    color: '#fff',
  },
};
