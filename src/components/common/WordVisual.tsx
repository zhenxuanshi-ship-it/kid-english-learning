import type { CSSProperties } from 'react';
import { getWordVisualResource } from '../../lib/images';
import type { Word } from '../../types/word';

interface WordVisualProps {
  word: Word;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 48,
  md: 72,
  lg: 96,
} as const;

export function WordVisual({ word, size = 'md' }: WordVisualProps) {
  const resource = getWordVisualResource(word);
  const px = sizeMap[size];

  if (resource.imageUrl) {
    return (
      <img
        src={resource.imageUrl}
        alt={word.english}
        style={{ ...styles.image, width: px, height: px }}
      />
    );
  }

  return (
    <div style={{ ...styles.fallback, width: px, height: px }}>
      <div style={styles.cover}>{resource.categoryCover}</div>
      <div style={styles.emoji}>{resource.fallbackEmoji}</div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  image: {
    objectFit: 'cover',
    borderRadius: 24,
    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
    background: '#fff',
  },
  fallback: {
    position: 'relative',
    borderRadius: 24,
    background: 'linear-gradient(180deg, #fff8f3 0%, #ffffff 100%)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
    display: 'grid',
    placeItems: 'center',
    overflow: 'hidden',
  },
  cover: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    fontSize: 24,
    opacity: 0.18,
  },
  emoji: {
    position: 'relative',
    fontSize: 38,
    lineHeight: 1,
  },
};
