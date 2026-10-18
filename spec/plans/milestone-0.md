# תוכנית – M0: Foundation ופריסה

> **מקור:** `MILESTONES.md` → M0. נשען על `ARCHITECTURE.md` (סעיפים 1, 2ג, 3, 4) ו-`DESIGN.md` (סעיפים 1.1 ו-2).
> **שם הקובץ:** אבן הדרך הראשונה ב-`MILESTONES.md` ממוספרת M0, ולכן הקובץ נקרא `milestone-0.md` (ו-M1 יהיה `milestone-1.md`), כדי שהמספרים יתאימו.
> **אין בו קוד.** זו תוכנית לבנייה בלבד.

---

## 1. מטרה ותוצר

שלד פרויקט שרץ מקומית ונפרס אוטומטית ל-GitHub Pages. בכתובת החיה נפתח מסך בית כהה, מיושר RTL, ובו רק ה-Header: "סיימון" בימין, Pill "שלב 1" בשמאל וקו מפריד מתחת.

**לא נכלל ב-M0:** לוח המשחק, הצלילים, לוח הניקוד, חלון הסיכום, PWA ו-CSP. אלה שייכים ל-M1–M4.

---

## 2. עובדות מהסביבה הנוכחית (נבדקו בתכנון)

| נושא | מצב | השלכה |
|---|---|---|
| Git remote | `origin` כבר מחובר ל-`https://github.com/amitaiga/Simon.git` | שלב "יצירת Repository" של המשתמש כנראה כבר בוצע. הכתובת החיה הצפויה: `https://amitaiga.github.io/Simon/`, ונתיב הבסיס בייצור: `/Simon/` |
| Node.js מקומי | `v25.1.0` (לא 24 LTS) | עומד בדרישת Vite 8 (20.19+ / 22.12+), ולכן הפיתוח המקומי יעבוד. ה-CI ירוץ על Node 24 כנדרש ב-ARCHITECTURE. לא נדרש להחליף גרסה מקומית. יתועד כ-ADR |
| npm מקומי | `11.6.4` | תקין |
| `.gitignore` | קיים, כולל `node_modules/`, `dist/`, `.env` | אין צורך בשינוי |
| סודות / `.env` | אין צורך כלל (ARCHITECTURE 3ה) | לא נוצרים `.env` ו-`.env.example` |
| החלטות פתוחות | אין החלטה פתוחה שמשויכת ל-M0 | אפשר לבנות בלי לעצור לשאלות עיצוב |

---

## 3. קבצים ליצור

```
/
├── .github/workflows/deploy.yml
├── public/                     # ריק בשלב זה (.gitkeep) – אייקונים יגיעו ב-M4
├── src/
│   ├── main.ts                 # נקודת כניסה: טוען CSS וקורא ל-App Shell
│   ├── app/app.ts              # App Shell: מרכיב את מסך הבית לתוך #app
│   ├── ui/homeScreen.ts        # Home Screen: בשלב זה Header בלבד
│   ├── game/.gitkeep           # Game Engine + Config יגיעו ב-M1
│   ├── services/.gitkeep       # Audio (M1) ו-Storage (M3)
│   ├── i18n/strings.ts         # כל טקסטי הממשק בעברית
│   └── styles/
│       ├── tokens.css          # משתני CSS: צבעים, גופן, רדיוסים, מרווחים, יחידת קנה מידה
│       └── main.css            # בסיס הדף + Header
├── tests/strings.test.ts       # בדיקה בסיסית אחת
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── package-lock.json           # נוצר ע"י npm install
```

ב-M0 לא נוצרים קבצים ריקים ל-Board, Scoreboard ו-Overlay. הם נוצרים באבני הדרך שבהן הם נבנים (M1, M3, M2), בתוך `src/ui/`. כך נשמר המבנה של ARCHITECTURE סעיף 4 בלי קוד מת.

---

## 4. פירוט לפי קובץ

### 4.1 `package.json`
- `"type": "module"`, `"private": true`, שם `simon`.
- **devDependencies** (אין dependencies לזמן ריצה): `vite` 8.x, `typescript` 6.x, `vitest` 4.1 ומעלה. הגרסאות המדויקות נקבעות בהתקנה (`npm install -D`) לפי הגרסה היציבה האחרונה בטווח, ונועלות ב-`package-lock.json`. לפני ההתקנה בודקים עם `npm view` שהגרסאות קיימות, ושאין התנגשות peer בין Vitest ל-Vite 8.
- **scripts:**
  - `dev` → `vite`
  - `build` → `vite build`
  - `preview` → `vite preview`
  - `test` → `vitest run`
  - `typecheck` → `tsc --noEmit`
- `engines.node`: `>=22.12` (מאפשר את Node 25 המקומי ואת 24 ב-CI).

### 4.2 `tsconfig.json`
- `strict: true`, `noEmit: true`, `target`/`lib` עדכניים (ES2022 + DOM), `module: ESNext`, `moduleResolution: bundler`, `isolatedModules: true`, `types: ["vite/client"]`.
- `include`: `src`, `tests`, `vite.config.ts`.

### 4.3 `vite.config.ts`
- `base` נקרא ממשתנה הסביבה `BASE_PATH`, ואם אינו קיים – `/`. בהרצה מקומית לא מגדירים אותו; ה-Workflow מגדיר אותו ל-`/<שם-repo>/` מתוך `github.event.repository.name`.
- הגדרת `test` של Vitest באותו קובץ: `environment: 'node'`, `include: ['tests/**/*.test.ts']`.
- זה הערך שישמש ב-M4 גם ל-`start_url`/`scope` של ה-Manifest.

### 4.4 `index.html`
- `<html lang="he" dir="rtl">`, `<meta charset="UTF-8">`.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- `<meta name="theme-color" content="#0F1110">`.
- `<title>סיימון</title>`.
- `<div id="app"></div>` ו-`<script type="module" src="/src/main.ts">`.
- אין סקריפטים, פונטים או משאבים חיצוניים.

### 4.5 `src/i18n/strings.ts`
אובייקט אחד (`as const`) עם כל טקסטי הממשק מטבלת "טקסטי הממשק" ב-DESIGN, כולל אלה שישמשו רק באבני הדרך הבאות, כדי שיהיה מקום אחד לכל הטקסטים:
- `appTitle`: "סיימון"
- `level(n)`: "שלב N" (Pill ושורות הרשימה)
- `start`: "התחל"
- `bestLabel`: "שיא אישי"; `bestValue(n)`: "N מתוך 10"
- `recentTitle`: "משחקים אחרונים"
- `lostAt(n)`: "הפסדת בשלב N"
- `newBest`: "שברת שיא אישי"
- `playAgain`: "שחק שוב"

טקסטים שתלויים בהחלטות פתוחות (כותרת ניצחון, מצב ריק, אחסון לא זמין) **אינם** נוספים עכשיו.

### 4.6 `src/styles/tokens.css`
משתני CSS על `:root`, עם ערכי ה-HEX המדויקים מ-DESIGN 2.1:
- **צבעי משחק:** `--green-lit #18D770`, `--green-idle #136037`, `--green-edge #0C9A4F`; `--red-lit #FA4A32`, `--red-idle #6D281E`, `--red-edge #C92A18`; `--yellow-lit #EED729`, `--yellow-idle #68601A`, `--yellow-edge #E09400`; `--blue-lit #219CDF`, `--blue-idle #164963`, `--blue-edge #1779B8`.
- **Neutrals:** `--ink #0F1110`, `--bezel #191B1A`, `--surface #242827`, `--line #3A3F3D`, `--muted #BCBCBC`, `--cloud #E6E6E6`, `--white #FFFFFF`, `--board-housing #0A0B0B`.
- **גופן:** `--font-family: Arial, Helvetica, sans-serif`.
- **רדיוסים:** `--radius-pill: 9999px`, `--radius-card: 24`, `--radius-row: 14`, `--radius-chip: 8` (בסולם ה-Style Guide; הערכים הספציפיים למסכים – 28, 16, 12 – יוגדרו ברכיבים עצמם באבני הדרך הבאות).
- **מרווחים:** `--space-1..7` = 4 / 8 / 12 / 16 / 24 / 32 / 48.
- **יחידת קנה מידה (`--u`):** המידות ב-DESIGN נתונות ביחידות עיצוב על רוחב 404. מגדירים `--u: calc(min(100vw, 480px) / 404)` וכל מידה נכתבת כ-`calc(<ערך> * var(--u))`. כך הפריסה מתכווננת לרוחב הטלפון, ובמחשב היא לא נמתחת מעבר ל-480px. הרדיוסים והמרווחים שלמעלה נשמרים כמספרים ומוכפלים ב-`--u` בשימוש. יתועד כ-ADR.

### 4.7 `src/styles/main.css`
- `box-sizing: border-box` גלובלי, איפוס margin.
- `html, body`: רקע `--ink`, צבע טקסט `--cloud`, `font-family` מהמשתנה, `min-height: 100dvh`.
- עמודת תוכן אחת, ממורכזת, ברוחב מקסימלי 480px, עם ריפוד צדדי `26u` ותוספת `env(safe-area-inset-*)` (בגלל `viewport-fit=cover`).
- הדף נגלל אנכית כשהתוכן ארוך מהמסך (DESIGN: "מסכים נמוכים").
- **Header** (לפי ה-Mockup "מסך בית"):
  - `display: flex`, `justify-content: space-between`, `align-items: center`. בגלל `dir="rtl"` האלמנט הראשון (הכותרת) יושב בימין וה-Pill בשמאל, בלי היפוך ידני.
  - כותרת "סיימון": `<h1>`, 34u, Bold, `--white`.
  - Pill "שלב 1": 134u × 48u, רדיוס מלא, מילוי `--ink`, קו מתאר 3u `--white`, טקסט 26u Bold `--white`, ממורכז.
  - קו מפריד מתחת ל-Header: עובי 2u בצבע `--line`, במיקום אנכי ~130u מראש המסך (מרכז ה-Header בערך ב-y≈92u).

### 4.8 `src/ui/homeScreen.ts`
פונקציה שיוצרת את מבנה ה-DOM של מסך הבית ומחזירה אותו: `<header>` עם `h1` (מ-`strings.appTitle`) ו-`<span class="level-pill">` (מ-`strings.level(1)`), ו-`<main>` ריק שבו ייכנסו הלוח והניקוד באבני הדרך הבאות. ה-Pill מקבל `aria-live="polite"` כבר עכשיו, כי ב-M1 הוא יתעדכן בזמן משחק.

### 4.9 `src/app/app.ts` ו-`src/main.ts`
- `app.ts`: מקבל את אלמנט `#app` ומרכיב לתוכו את מסך הבית.
- `main.ts`: מייבא את קובצי ה-CSS וקורא ל-App Shell.

### 4.10 `tests/strings.test.ts`
בדיקה בסיסית אחת (כנדרש) שמוודאת שהתשתית עובדת: `strings.appTitle` הוא "סיימון" ו-`strings.level(1)` הוא "שלב 1".

### 4.11 `.github/workflows/deploy.yml`
לפי ARCHITECTURE 3ג ותבנית הפריסה הרשמית בתיעוד של Vite (גרסאות ה-Actions הראשיות העדכניות נבדקות שם בזמן הבנייה):
- **טריגרים:** `push` ל-`main` ו-`workflow_dispatch`.
- **permissions:** `contents: read`, `pages: write`, `id-token: write`.
- **concurrency:** קבוצה `pages`, `cancel-in-progress: false`.
- **Job `build`:** `actions/checkout` → `actions/setup-node` (Node 24, `cache: npm`) → `npm ci` → `npx tsc --noEmit` → `npm test` → `npm run build` עם `BASE_PATH: /${{ github.event.repository.name }}/` → `actions/configure-pages` → `actions/upload-pages-artifact` על `dist`.
- **Job `deploy`:** `needs: build`, `environment: github-pages` (עם `url` מתוצאת הפריסה) → `actions/deploy-pages`.
- כל כשל בבדיקת טיפוסים, בבדיקות או ב-Build עוצר לפני הפריסה.

### 4.12 עדכונים במסמכים
- **CLAUDE.md → "פקודות הרצה":** הרצה (dev): `npm run dev`; בדיקות (test): `npm test`.
- **ARCHITECTURE.md → `## החלטות מרכזיות (ADRs)`** (סעיף חדש בסוף הקובץ):
  - ADR-1: הזרקת נתיב הבסיס דרך משתנה הסביבה `BASE_PATH` (ב-CI מתוך שם ה-Repository, מקומית `/`).
  - ADR-2: יחידת קנה מידה `--u` לתרגום מידות ה-Mockup (רוחב 404) לרוחב המכשיר, עם תקרה של 480px.
  - ADR-3: Node מקומי 25 לעומת Node 24 ב-CI, ו-`engines` שמתיר את שניהם.
- **MILESTONES.md:** סימון 🟡 ליד כותרת M0 בסיום הבנייה.

---

## 5. סדר עבודה בבנייה

1. בדיקת גרסאות זמינות (`npm view vite / typescript / vitest`) ובדיקת תבנית ה-Workflow העדכנית בתיעוד Vite.
2. יצירת `package.json`, התקנת החבילות (`npm install -D ...`) ← נוצר `package-lock.json`.
3. `tsconfig.json`, `vite.config.ts`, `index.html`.
4. `tokens.css`, `main.css`, `strings.ts`, `homeScreen.ts`, `app.ts`, `main.ts`.
5. `tests/strings.test.ts`.
6. `.github/workflows/deploy.yml`.
7. אימות עצמי (סעיף 6), תיקונים.
8. עדכון CLAUDE.md, ADRs ו-🟡 ב-MILESTONES.md. סגירת כל הרצה. **בלי commit ובלי push.**

---

## 6. אימות עצמי בזמן הבנייה

| בדיקה | איך |
|---|---|
| התקנה נקייה | מחיקת `node_modules` (תיקייה שנוצרה בבנייה בלבד) והרצת `npm ci` |
| טיפוסים | `npx tsc --noEmit` ללא שגיאות |
| בדיקות | `npm test` ירוק |
| Build | `npm run build` מצליח |
| Header במסך | `npm run dev` + דפדפן ה-Preview ברוחב מובייל (375): צילום מסך והשוואה ל-Mockup – כותרת בימין, Pill בשמאל, קו מפריד, רקע כהה |
| נתיב בסיס | Build עם `BASE_PATH=/Simon/` ואחריו `npm run preview`: הדף נטען ב-`/Simon/` בלי שגיאות 404 על JS/CSS (בדיקה ב-Network ובקונסול) |
| צבעים | השוואת `tokens.css` לטבלאות DESIGN 2.1 – כל 20 הצבעים, HEX מדויק |
| ללא קריאות חיצוניות | חיפוש `http` / `fetch` / CDN ב-`src` וב-`index.html`; בדיקת Network שאין בקשות לדומיין חיצוני |
| Workflow | קריאת הקובץ: סדר השלבים `tsc` → `test` → `build` → upload → deploy |

---

## 7. חלקים שדורשים את המשתמש (אחרי הבנייה, ורק באישור)

לפי CLAUDE.md, אין push בלי אישור. לפי MILESTONES, ב-M0 הדחיפה נעשית **לפני** האישור הסופי, כי הבדיקה היא בכתובת החיה. לכן בסיום הבנייה:

1. **אישור דחיפה:** אבקש אישור מפורש לבצע commit + push ראשון ל-`main` (ה-remote כבר מחובר ל-`amitaiga/Simon`). אוודא איתך שזה ה-Repository הנכון ושהוא ציבורי.
2. **הגדרת Pages (את/ה, בהדרכה צעד-אחר-צעד):** ב-GitHub → Settings → Pages → Source → **GitHub Actions**.
3. **הרצת ה-Workflow:** אם הריצה הראשונה נכשלה כי Pages עוד לא הוגדר – הפעלה חוזרת מלשונית Actions (`Run workflow`).
4. **בדיקה בכתובת החיה:** `https://amitaiga.github.io/Simon/` – הדף נטען עם ה-Header, בלי שגיאות 404.

ה-🟡 נשאר עד שתאשר/י. ה-✅ מסומן רק אחרי שהאתר החי נבדק ואושר.

---

## 8. Definition of Done – מיפוי לבדיקה

| סעיף DoD | איך מאומת | מתי |
|---|---|---|
| `npm ci`, `tsc --noEmit`, `npm test`, `npm run build` עוברים | הרצה מקומית | בבנייה |
| `npm run dev` מציג Header כמו ב-Mockup | צילום מסך בדפדפן ה-Preview | בבנייה |
| ה-Workflow רץ בהצלחה והאתר נטען בכתובת החיה בלי 404 | לשונית Actions + פתיחת הכתובת | אחרי push באישור |
| שלבי טיפוסים ובדיקות לפני Build ופריסה | קריאת `deploy.yml` | בבנייה |
| כל צבעי DESIGN 2.1 כמשתני CSS מדויקים | השוואה ל-`tokens.css` | בבנייה |
| אין סודות, משתני סביבה סודיים או קריאות רשת חיצוניות | חיפוש בקוד + Network | בבנייה |
