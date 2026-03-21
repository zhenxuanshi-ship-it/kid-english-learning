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
          <div key={`${char}-${index}`} style={styles.slot}>{(char || '_').toUpperCase()}</div>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.row}>
      {Array.from({ length: answerLength }).map((_, index) => (
        <div key={index} style={styles.slot}>{(text[index] ?? '_').toUpperCase()}</div>
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
    width: 42,
    height: 48,
    borderRadius: 14,
    background: '#f7f9fc',
    border: '2px dashed #cfd8dc',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    fontSize: 20,
  },
};
