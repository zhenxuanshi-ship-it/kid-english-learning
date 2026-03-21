import { ANALYTICS_SITE_ID, APP_ENV, APP_VERSION, SENTRY_DSN } from './runtime';

interface ErrorContext {
  scope?: string;
  extra?: Record<string, unknown>;
}

function isEnabled(value: string) {
  return value.trim().length > 0;
}

export function initTelemetry() {
  if (import.meta.env.DEV) return;

  if (isEnabled(SENTRY_DSN)) {
    console.info('[telemetry] sentry placeholder enabled', { env: APP_ENV, version: APP_VERSION });
  }

  if (isEnabled(ANALYTICS_SITE_ID)) {
    console.info('[telemetry] analytics placeholder enabled', { siteId: ANALYTICS_SITE_ID, env: APP_ENV });
  }
}

export function captureError(error: unknown, context?: ErrorContext) {
  console.error('[telemetry:error]', {
    error,
    context,
    env: APP_ENV,
    version: APP_VERSION,
    sentryConfigured: isEnabled(SENTRY_DSN),
  });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (!isEnabled(ANALYTICS_SITE_ID)) return;

  console.info('[telemetry:event]', {
    name,
    props,
    siteId: ANALYTICS_SITE_ID,
    env: APP_ENV,
    version: APP_VERSION,
  });
}
