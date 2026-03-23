import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SentencePatternCardPage } from './SentencePatternCardPage';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

vi.mock('../lib/telemetry', () => ({
  trackEvent: vi.fn(),
}));

describe('SentencePatternCardPage', () => {
  it('renders pattern title', () => {
    render(<SentencePatternCardPage
      pattern={{ id: 'this_is', title: 'This is ...', description: '认识这个句型', examples: ['This is a cat'] }}
      onStart={vi.fn()}
      onBack={vi.fn()}
    />);
    expect(screen.getByText('This is ...')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<SentencePatternCardPage
      pattern={{ id: 'this_is', title: 'T', description: '句型描述', examples: [] }}
      onStart={vi.fn()}
      onBack={vi.fn()}
    />);
    expect(screen.getByText('句型描述')).toBeInTheDocument();
  });

  it('renders all examples', () => {
    render(<SentencePatternCardPage
      pattern={{ id: 'this_is', title: 'T', description: '', examples: ['This is a cat', 'This is a dog', 'This is a book'] }}
      onStart={vi.fn()}
      onBack={vi.fn()}
    />);
    expect(screen.getByText('This is a cat')).toBeInTheDocument();
    expect(screen.getByText('This is a dog')).toBeInTheDocument();
    expect(screen.getByText('This is a book')).toBeInTheDocument();
  });

  it('renders start button', () => {
    render(<SentencePatternCardPage
      pattern={{ id: 'this_is', title: 'T', description: '', examples: [] }}
      onStart={vi.fn()}
      onBack={vi.fn()}
    />);
    expect(screen.getByText('开始练这个句型')).toBeInTheDocument();
  });

  it('calls onStart when start button clicked', () => {
    const onStart = vi.fn();
    render(<SentencePatternCardPage
      pattern={{ id: 'this_is', title: 'T', description: '', examples: [] }}
      onStart={onStart}
      onBack={vi.fn()}
    />);
    fireEvent.click(screen.getByText('开始练这个句型'));
    expect(onStart).toHaveBeenCalled();
  });

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn();
    render(<SentencePatternCardPage
      pattern={{ id: 'this_is', title: 'T', description: '', examples: [] }}
      onStart={vi.fn()}
      onBack={onBack}
    />);
    fireEvent.click(screen.getByText('回句式入口'));
    expect(onBack).toHaveBeenCalled();
  });

  it('returns null when pattern is undefined', () => {
    const { container } = render(<SentencePatternCardPage
      pattern={undefined}
      onStart={vi.fn()}
      onBack={vi.fn()}
    />);
    expect(container).toBeEmptyDOMElement();
  });
});
