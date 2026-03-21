import type { CSSProperties } from 'react';

interface InputSlotsProps {
  text: string;
  answerLength?: number;
  pattern?: string[];
  missingIndexes?: number[];
}

export function InputSlots({ text, answerLength = 0, pattern, missingIndexes = [] }: InputSlotsProps) {
  if (pattern) {
    const chars = [...pattern];
    missingIndexes.forEach((index, idx) => {
      chars[index] = text[idx] ?? '_';
    });
    return (
      <div style={styles.row}>
        {chars.map((char, index) => (
          <div key={`${char}-${index}`} style={{ ...styles.slot, ...(char === '_' ? styles.blank : {}) }}>
            {(char || '_').toUpperCase()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.row}>
      {Array.from({ length: answerLength }).map((_, index) => (
        <div key={index} style={{ ...styles.slot, ...(text[index] ? styles.filled : styles.blank) }}>
          {(text[index] ?? '_').toUpperCase()}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  row: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  slot: {
    width: 44,
    height: 52,
    borderRadius: 16,
    background: '#ffffff',
    border: '3px solid #dfe8eb',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    fontSize: 20,
    boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
  },
  blank: {
    background: '#f7f9fc',
    color: '#9fb0b6',
  },
  filled: {
    borderColor: '#4ecdc4',
    background: '#f2fffd',
  },
};
