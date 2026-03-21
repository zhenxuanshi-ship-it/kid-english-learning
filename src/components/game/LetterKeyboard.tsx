import type { CSSProperties } from 'react';

interface LetterKeyboardProps {
  letters: string[];
  disabledLetters: number[];
  onPick: (letter: string, index: number) => void;
  onDelete: () => void;
}

export function LetterKeyboard({ letters, disabledLetters, onPick, onDelete }: LetterKeyboardProps) {
  return (
    <div style={styles.wrap}>
      <div style={styles.grid}>
        {letters.map((letter, index) => {
          const disabled = disabledLetters.includes(index);
          return (
            <button
              key={`${letter}-${index}`}
              style={{ ...styles.key, ...(disabled ? styles.disabled : {}) }}
              onClick={() => onPick(letter, index)}
              disabled={disabled}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>
      <button style={styles.delete} onClick={onDelete}>← 删除</button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: 'grid', gap: 12 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: 10,
  },
  key: {
    minHeight: 52,
    border: 'none',
    borderRadius: 16,
    background: '#ffe66d',
    color: '#2d3436',
    fontWeight: 800,
    fontSize: 18,
    cursor: 'pointer',
  },
  disabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  delete: {
    minHeight: 52,
    border: 'none',
    borderRadius: 16,
    background: '#ff7675',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  },
};
