/**
 * Supabase children API unit tests.
 *
 * Note: These tests currently run against the real Supabase instance.
 * RLS policies block mutations in tests (expected behavior).
 * The key value here is verifying the API functions execute without crashes.
 */

import { describe, expect, it } from 'vitest';

import {
  getChildren,
  getChildrenSummary,
} from './children';

describe('supabase children API', () => {
  it('getChildren returns an array', async () => {
    const result = await getChildren();
    expect(Array.isArray(result)).toBe(true);
  });

  it('getChildrenSummary returns an array', async () => {
    const result = await getChildrenSummary();
    expect(Array.isArray(result)).toBe(true);
  });
});
