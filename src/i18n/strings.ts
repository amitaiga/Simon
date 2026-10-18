// All user-facing UI text (Hebrew), from spec/DESIGN.md "טקסטי הממשק".
export const strings = {
  appTitle: 'סיימון',
  level: (n: number) => `שלב ${n}`,
  start: 'התחל',
  bestLabel: 'שיא אישי',
  bestValue: (n: number) => `${n} מתוך 10`,
  recentTitle: 'משחקים אחרונים',
  lostAt: (n: number) => `הפסדת בשלב ${n}`,
  newBest: 'שברת שיא אישי',
  playAgain: 'שחק שוב',
} as const;
