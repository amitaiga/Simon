import { describe, expect, it } from 'vitest';
import { strings } from '../src/i18n/strings';

describe('strings', () => {
  it('provides the Hebrew app title and level label', () => {
    expect(strings.appTitle).toBe('סיימון');
    expect(strings.level(1)).toBe('שלב 1');
  });

  it('provides the summary overlay texts', () => {
    expect(strings.lostAt(4)).toBe('הפסדת בשלב 4');
    expect(strings.playAgain).toBe('שחק שוב');
  });
});
