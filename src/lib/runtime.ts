export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev';
export const APP_ENV = import.meta.env.MODE;
export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';
export const ANALYTICS_SITE_ID = import.meta.env.VITE_ANALYTICS_SITE_ID ?? '';

export interface StorageDiagnostics {
  localStorageAvailable: boolean;
  persistenceSupported: boolean;
  persistenceGranted: boolean;
}

export async function getStorageDiagnostics(): Promise<StorageDiagnostics> {
  const localStorageAvailable = (() => {
    try {
      localStorage.setItem('__storage_test__', '1');
      localStorage.removeItem('__storage_test__');
      return true;
    } catch {
      return false;
    }
  })();

  const persistenceSupported = typeof navigator !== 'undefined' && Boolean(navigator.storage?.persist);
  const persistenceGranted = persistenceSupported && navigator.storage?.persisted ? await navigator.storage.persisted() : false;

  return {
    localStorageAvailable,
    persistenceSupported,
    persistenceGranted,
  };
}

export async function ensurePersistentStorage(): Promise<StorageDiagnostics> {
  const diagnostics = await getStorageDiagnostics();
  if (diagnostics.persistenceSupported && !diagnostics.persistenceGranted) {
    try {
      const granted = await navigator.storage.persist();
      return {
        ...diagnostics,
        persistenceGranted: granted,
      };
    } catch {
      return diagnostics;
    }
  }
  return diagnostics;
}

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
