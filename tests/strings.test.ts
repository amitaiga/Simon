import { describe, expect, it } from 'vitest';
import { strings } from '../src/i18n/strings';

describe('strings', () => {
  it('provides the Hebrew app title and level label', () => {
    expect(strings.appTitle).toBe('סיימון');
    expect(strings.level(1)).toBe('שלב 1');
  });
});
