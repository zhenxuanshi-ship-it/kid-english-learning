import { describe, expect, it, vi, beforeEach } from 'vitest';
import { initTelemetry, captureError, trackEvent } from './telemetry';

describe('telemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('initTelemetry does not throw', () => {
    expect(initTelemetry).not.toThrow();
  });

  it('captureError does not throw with Error object', () => {
    const err = new Error('test error');
    expect(() => captureError(err)).not.toThrow();
  });

  it('captureError does not throw with string', () => {
    expect(() => captureError('string error')).not.toThrow();
  });

  it('captureError does not throw with null', () => {
    expect(() => captureError(null)).not.toThrow();
  });

  it('trackEvent does not throw', () => {
    expect(() => trackEvent('test_event')).not.toThrow();
  });

  it('trackEvent does not throw with properties', () => {
    expect(() => trackEvent('test_event', { key: 'value' })).not.toThrow();
  });
});
