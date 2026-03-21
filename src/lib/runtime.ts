export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev';
export const APP_ENV = import.meta.env.MODE;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';
export const ANALYTICS_SITE_ID = import.meta.env.VITE_ANALYTICS_SITE_ID ?? '';

export function logRuntimeBoot() {
  if (import.meta.env.DEV) {
    console.info('[runtime]', {
      env: APP_ENV,
      version: APP_VERSION,
      sentryConfigured: Boolean(SENTRY_DSN),
      analyticsConfigured: Boolean(ANALYTICS_SITE_ID),
    });
  }
}
