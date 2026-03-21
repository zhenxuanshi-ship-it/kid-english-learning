import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WordVisual } from './WordVisual';

describe('WordVisual', () => {
  it('renders an image when imageUrl exists', () => {
    render(
      <WordVisual
        word={{ id: 1, english: 'cat', chinese: '猫', category: 'animals', level: 1, difficulty: 1, emoji: '🐱', imageUrl: '/cat.svg' }}
      />,
    );

    expect(screen.getByAltText('cat')).toBeInTheDocument();
  });

  it('renders fallback emoji when imageUrl is missing', () => {
    render(
      <WordVisual
        word={{ id: 2, english: 'lion', chinese: '狮子', category: 'animals', level: 2, difficulty: 2, emoji: '🦁' }}
      />,
    );

    expect(screen.getByText('🦁')).toBeInTheDocument();
  });
});
