// All user-facing UI text (Hebrew), from spec/DESIGN.md "טקסטי הממשק".
export const strings = {
  appTitle: 'סיימון',
  level: (n: number) => `שלב ${n}`,
  start: 'התחל',
  watch: 'צפה',
  yourTurn: 'תורך',
  // Screen-reader labels for the color buttons (not shown on screen)
  colorNames: { green: 'ירוק', red: 'אדום', yellow: 'צהוב', blue: 'כחול' },
  bestLabel: 'שיא אישי',
  // No level limit (ADR-8), so the best value is shown as a level
  bestValue: (n: number) => `שלב ${n}`,
  recentTitle: 'משחקים אחרונים',
  lostAt: (n: number) => `הפסדת בשלב ${n}`,
  newBest: 'שברת שיא אישי',
  playAgain: 'שחק שוב',
} as const;
