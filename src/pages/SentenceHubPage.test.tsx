import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SentenceHubPage } from './SentenceHubPage';
import type { SentencePatternId } from '../types/sentence';

vi.mock('framer-motion', () => {
  const MockDiv = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return { motion: { div: MockDiv } };
});

const mockPatterns: Array<{ id: SentencePatternId; title: string; description: string; examples: string[] }> = [
  { id: 'this_is', title: 'This is ...', description: '认识"这是..."', examples: ['This is a dog.'] },
  { id: 'i_like', title: 'I like ...', description: '认识"我喜欢..."', examples: ['I like burgers.'] },
  { id: 'whos_this', title: "Who's this?", description: '认识"这是谁?"', examples: ["Who's this? This is my mom."] },
];

describe('SentenceHubPage', () => {
  const defaultProps = {
    progressMap: {} as Parameters<typeof SentenceHubPage>[0]['progressMap'],
    orderedPatterns: mockPatterns,
    recommendedPattern: mockPatterns[0],
    continuePattern: mockPatterns[1],
    reviewPattern: mockPatterns[2],
    reviewCount: 3,
    onStartPattern: vi.fn(),
  };

  it('renders sentence hub title', () => {
    render(<SentenceHubPage {...defaultProps} />);
    expect(screen.getByText(/句式练习/)).toBeInTheDocument();
  });

  it('renders pattern list', () => {
    render(<SentenceHubPage {...defaultProps} />);
    // Use getAllByText since patterns may appear in multiple places
    expect(screen.getAllByText('This is ...').length).toBeGreaterThan(0);
    expect(screen.getAllByText("Who's this?").length).toBeGreaterThan(0);
  });

});
