import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { captureError, trackEvent } from '../lib/telemetry';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    captureError(error, { scope: 'react-error-boundary' });
  }

  handleReload = () => {
    trackEvent('error_boundary_reload_click');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main style={styles.page}>
          <div style={styles.card}>
            <div style={styles.emoji}>🛠️</div>
            <div style={styles.title}>页面刚刚打了个小喷嚏</div>
            <div style={styles.text}>别担心，刷新一下通常就能恢复。上线后也建议接 Sentry 之类的错误监控。</div>
            <button style={styles.button} onClick={this.handleReload}>重新加载</button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    background: 'linear-gradient(180deg, #fff8f5 0%, #ffffff 100%)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    background: '#fff',
    boxShadow: '0 16px 32px rgba(0,0,0,0.08)',
    padding: 24,
    display: 'grid',
    gap: 10,
    textAlign: 'center',
  },
  emoji: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: 900, color: '#384349' },
  text: { fontSize: 14, fontWeight: 700, color: '#66757b' },
  button: {
    minHeight: 48,
    border: 'none',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e7b)',
    color: '#fff',
    fontWeight: 900,
  },
};
