/**
 * capture.js — Portfolio screenshot capture script.
 *
 * Captures real app screenshots and saves them into the exact paths
 * that the portfolio content files expect.
 *
 * Usage:
 *   node scripts/capture.js [project]
 *   node scripts/capture.js tovi
 *
 * Prerequisites — must be running before you invoke this script:
 *
 *   Tovi:
 *     cd ~/Tovi
 *     VITE_MOCK=1 VITE_CELO_NETWORK=celo-mainnet npm run dev
 *     (starts at localhost:5173 — no backend needed, no testnet badges)
 *
 * Output paths (saved into public/images/):
 *   tovi/hero.png      — Home screen at mobile viewport, @3x (390×844 → 1170×2532px file)
 *   tovi/screen-1.png  — Home — balance + recent transactions
 *   tovi/screen-2.png  — Activity feed — all transactions grouped by date
 *   tovi/screen-3.png  — Receive — avatar, QR code, pay link
 *   tovi/screen-4.png  — You / profile — account and settings
 *
 * Projects NOT covered by this script (require manual screenshots):
 *   alune  — server-side Supabase auth, no offline mock path
 *   anse   — no source code exists (concept MVP)
 *   chess  — Android-only; use emulator + adb screencap
 *   sudoku — Android-only; use emulator + adb screencap
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ─── Config ──────────────────────────────────────────────────────────────────

const PUBLIC_DIR = path.join(__dirname, '../public/images');
const TOVI_BASE  = process.env.TOVI_URL ?? 'http://localhost:5173';

// iPhone 14 logical dimensions — the sweet spot for mobile PWA screenshots.
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// @3x → actual pixel file is 1170×2532, crisp on retina displays.
const DEVICE_SCALE = 3;

// CSS injected into every page to strip dev/testnet indicators that would
// look out of place in a portfolio. Uses attribute selectors so it's
// resilient to class-name changes.
const PORTFOLIO_CSS = `
  /* Hide the testnet badge pill (amber dot + "Testnet" text) */
  [aria-label*="test network"],
  [aria-label*="Testnet"] { display: none !important; }

  /* Hide the testnet faucet banner that appears on the Receive screen */
  [data-testid="testnet-banner"],
  [class*="testnet-banner"] { display: none !important; }

  /* Suppress all CSS transitions and animations — screenshots are instant */
  *, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Create a fresh browser context pre-wired for Tovi portfolio captures.
 * Includes the CSS override, device scale, and an injected script that
 * seeds the mock session before the React app boots — so AuthGate sees a
 * valid session on the very first render and skips the redirect to /welcome.
 */
async function toviContext(browser) {
  const ctx = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE,
  });

  // Inject session BEFORE the page loads so the auth store finds it immediately.
  // Mirrors what ?seed=maya does but without relying on the URL param redirect.
  await ctx.addInitScript(() => {
    const SESSION_KEY = 'tovi_session';
    const session = {
      user: {
        id: 'u-self',
        displayName: 'Maya Chen',
        handle: 'maya',
        avatarInitial: 'M',
        phone: '+14155550101',
        joinedAt: '2024-11-01T00:00:00Z',
      },
      token: 'dev-token',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  });

  return ctx;
}

/**
 * Navigate to a route, wait for content to settle, then screenshot.
 * `waitFor` is an optional selector — if provided, we wait until it's visible
 * before capturing. Defaults to a brief fixed wait when omitted.
 */
async function capture(page, route, filePath, { waitFor, extraWait = 400 } = {}) {
  await page.goto(`${TOVI_BASE}${route}`, { waitUntil: 'domcontentloaded' });
  // Inject CSS overrides after navigation (must be per-page, not per-context)
  await page.addStyleTag({ content: PORTFOLIO_CSS });

  if (waitFor) {
    await page.waitForSelector(waitFor, { state: 'visible', timeout: 8000 });
  }

  // Let async updates finish (balance fetch, image decoding, focus rings, etc.)
  await wait(extraWait);

  await page.screenshot({
    path: filePath,
    animations: 'disabled',
    fullPage: false,        // viewport crop — captures exactly what's on screen
  });

  const rel = path.relative(path.join(__dirname, '..'), filePath);
  console.log(`  ✓  ${rel}`);
}

// ─── Tovi ─────────────────────────────────────────────────────────────────────

async function captureTovi(browser) {
  console.log('\n── Tovi ─────────────────────────────────────────────────────');
  console.log(`   Base URL : ${TOVI_BASE}`);
  console.log(`   Viewport : ${MOBILE_VIEWPORT.width}×${MOBILE_VIEWPORT.height} @${DEVICE_SCALE}x`);
  console.log(`   Mock API : VITE_MOCK=1 (no backend needed)`);
  console.log(`   Network  : VITE_CELO_NETWORK=celo-mainnet (no testnet badges)\n`);

  const outDir = path.join(PUBLIC_DIR, 'tovi');
  ensureDir(outDir);

  // ── hero: Home screen ────────────────────────────────────────────────────
  // Same as screen-1 but captured first with a longer settle time.
  // The portfolio WorkRow shows this as the primary project thumbnail.
  {
    const ctx = await toviContext(browser);
    const page = await ctx.newPage();

    // Wait until the balance amount is rendered — confirms data has loaded
    // and we're not screenshotting the skeleton state.
    await capture(page, '/', path.join(outDir, 'hero.png'), {
      // The balance display uses font-variant-numeric: tabular-nums; target
      // the aria-label on the Amount span which is always present once loaded.
      waitFor: '[aria-label*="CELO"]',
      extraWait: 600,
    });

    await ctx.close();
  }

  // ── screen-1: Home — balance + recent transactions ────────────────────────
  {
    const ctx = await toviContext(browser);
    const page = await ctx.newPage();
    await capture(page, '/', path.join(outDir, 'screen-1.png'), {
      waitFor: '[aria-label*="CELO"]',
      extraWait: 400,
    });
    await ctx.close();
  }

  // ── screen-2: Activity feed ───────────────────────────────────────────────
  // Shows all 7 transactions grouped by date. A rich list communicates that
  // this is a real, working payment product.
  {
    const ctx = await toviContext(browser);
    const page = await ctx.newPage();

    // Boot on Home first so the wallet store is populated, then navigate
    await capture(page, '/', path.join(outDir, '_warmup_activity.png'), {
      waitFor: '[aria-label*="CELO"]',
      extraWait: 200,
    });
    fs.unlinkSync(path.join(outDir, '_warmup_activity.png')); // discard warmup

    await capture(page, '/activity', path.join(outDir, 'screen-2.png'), {
      // Wait for the first transaction row to appear
      waitFor: 'main, [role="main"], .tovi-activity, nav + div',
      extraWait: 500,
    });
    await ctx.close();
  }

  // ── screen-3: Receive — QR code + pay link ────────────────────────────────
  // The Receive screen is visually distinctive: avatar, large QR frame, and
  // the @handle text communicate the product concept clearly with no text.
  {
    const ctx = await toviContext(browser);
    const page = await ctx.newPage();

    // Boot on Home, then navigate to /receive (it's behind a modal route)
    await capture(page, '/', path.join(outDir, '_warmup_receive.png'), {
      waitFor: '[aria-label*="CELO"]',
      extraWait: 200,
    });
    fs.unlinkSync(path.join(outDir, '_warmup_receive.png')); // discard warmup

    await capture(page, '/receive', path.join(outDir, 'screen-3.png'), {
      // QR code is a canvas — wait for the avatar initial to confirm render
      waitFor: 'canvas, img, [aria-label="QR code"]',
      extraWait: 800, // QR canvas needs a tick to paint
    });
    await ctx.close();
  }

  // ── screen-4: You / profile ───────────────────────────────────────────────
  {
    const ctx = await toviContext(browser);
    const page = await ctx.newPage();

    await capture(page, '/you', path.join(outDir, 'screen-4.png'), {
      // Tovi uses inline styles throughout — just wait for the nav bar button
      // which is always the first interactive element rendered
      waitFor: 'button, nav',
      extraWait: 600,
    });
    await ctx.close();
  }

  console.log(`\n  5 screenshots saved → public/images/tovi/`);
  console.log('  Tovi content file already has src fields pre-populated.');
  console.log('  Commit public/images/tovi/ to make them live on Vercel.\n');
}

// ─── Alune ────────────────────────────────────────────────────────────────────

const ALUNE_BASE = process.env.ALUNE_URL ?? 'http://localhost:3000';

// Alune renders a centred phone-frame shell on desktop (≥640px).
// Capturing at 1440×900 includes the frame + warm dot-grid background,
// which looks premium in the portfolio WorkRow card.
const ALUNE_DESKTOP_VIEWPORT = { width: 1440, height: 900 };

// Mobile captures show the app full-screen, matching the portfolio's
// "desktop" variant container (Alune is a web app, not native Android).
const ALUNE_MOBILE_VIEWPORT = { width: 430, height: 932 };

async function captureAlune(browser) {
  console.log('\n── Alune ────────────────────────────────────────────────────');
  console.log(`   Base URL  : ${ALUNE_BASE}`);
  console.log(`   Routes    : /screenshot/today  /screenshot/closet`);
  console.log(`   Note      : no auth needed — screenshot routes bypass middleware\n`);

  const outDir = path.join(PUBLIC_DIR, 'alune');
  ensureDir(outDir);

  // CSS applied to every Alune page — suppresses animations for clean captures
  const CSS = `
    *, *::before, *::after {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  `;

  // ── hero: Today at desktop viewport (shows phone frame) ──────────────────
  {
    const ctx = await browser.newContext({
      viewport: ALUNE_DESKTOP_VIEWPORT,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${ALUNE_BASE}/screenshot/today`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: CSS });
    // Wait for the outfit name text to confirm the page content has rendered
    await page.waitForSelector('h3, [class*="serif"]', { timeout: 8000 });
    await wait(800);
    await page.screenshot({ path: path.join(outDir, 'hero.png'), animations: 'disabled' });
    console.log(`  ✓  public/images/alune/hero.png`);
    await ctx.close();
  }

  // ── screen-1: Today at mobile viewport ───────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: ALUNE_MOBILE_VIEWPORT,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(`${ALUNE_BASE}/screenshot/today`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: CSS });
    await page.waitForSelector('h3, [class*="serif"]', { timeout: 8000 });
    await wait(600);
    await page.screenshot({ path: path.join(outDir, 'screen-1.png'), animations: 'disabled' });
    console.log(`  ✓  public/images/alune/screen-1.png`);
    await ctx.close();
  }

  // ── screen-2: Closet items grid ───────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: ALUNE_MOBILE_VIEWPORT,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(`${ALUNE_BASE}/screenshot/closet`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: CSS });
    // Wait for item cards to render
    await page.waitForSelector('[class*="garment"], [class*="item"], h2, [class*="serif"]', { timeout: 8000 });
    await wait(600);
    await page.screenshot({ path: path.join(outDir, 'screen-2.png'), animations: 'disabled' });
    console.log(`  ✓  public/images/alune/screen-2.png`);
    await ctx.close();
  }

  // ── screen-3: Closet outfits tab ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: ALUNE_MOBILE_VIEWPORT,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(`${ALUNE_BASE}/screenshot/closet?tab=outfits`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: CSS });
    await page.waitForSelector('button, [class*="outfit"], [class*="serif"]', { timeout: 8000 });
    await wait(600);
    await page.screenshot({ path: path.join(outDir, 'screen-3.png'), animations: 'disabled' });
    console.log(`  ✓  public/images/alune/screen-3.png`);
    await ctx.close();
  }

  // ── screen-4: Today at a different scroll position or second pass ─────────
  // Shows the recent outfits section — scroll down to reveal the outfit cards.
  {
    const ctx = await browser.newContext({
      viewport: ALUNE_MOBILE_VIEWPORT,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    await page.goto(`${ALUNE_BASE}/screenshot/today`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: CSS });
    await page.waitForSelector('h3, [class*="serif"]', { timeout: 8000 });
    // Scroll down to show the "Recent outfits" section
    await page.evaluate(() => window.scrollBy(0, 340));
    await wait(500);
    await page.screenshot({ path: path.join(outDir, 'screen-4.png'), animations: 'disabled' });
    console.log(`  ✓  public/images/alune/screen-4.png`);
    await ctx.close();
  }

  console.log(`\n  5 screenshots saved → public/images/alune/`);
  console.log('  Update alune.ts src fields to activate the images.\n');
}

// ─── Anse ─────────────────────────────────────────────────────────────────────
// No source code exists — renders a pixel-precise HTML mockup via page.setContent()
// and captures at desktop viewport. No server needed.

const ANSE_VIEWPORT = { width: 1440, height: 900 };
const ANSE_SCALE    = 2;

// Shared design tokens used across both screens
const ANSE_TOKENS = `
  :root {
    --bg:       #F7F7F8;
    --surface:  #FFFFFF;
    --border:   #E4E4E7;
    --border-2: #D1D1D6;
    --ink:      #09090B;
    --ink-2:    #3F3F46;
    --ink-3:    #71717A;
    --ink-4:    #A1A1AA;
    --accent:   #2563EB;
    --accent-s: #EFF6FF;
    --crit-bg:  #FEF2F2; --crit:   #DC2626; --crit-border: #FECACA;
    --risk-bg:  #FFF7ED; --risk:   #C2410C; --risk-border: #FED7AA;
    --med-bg:   #FFFBEB; --med:    #B45309; --med-border:  #FDE68A;
    --low-bg:   #F0FDF4; --low:    #15803D; --low-border:  #BBF7D0;
    --radius:   6px;
    --shadow:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-2: 0 4px 12px rgba(0,0,0,0.08);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
    font-size: 13px; line-height: 1.5;
    background: var(--bg); color: var(--ink);
    -webkit-font-smoothing: antialiased;
  }
  /* Layout shell */
  .shell { display: flex; flex-direction: column; height: 100vh; }
  .topnav {
    height: 52px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 20px; gap: 0; flex-shrink: 0;
    position: relative; z-index: 10;
  }
  .topnav-logo {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink);
    margin-right: 32px;
  }
  .logo-mark {
    width: 26px; height: 26px; border-radius: 6px;
    background: var(--ink); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; letter-spacing: -0.03em;
  }
  .topnav-links { display: flex; align-items: center; gap: 2px; flex: 1; }
  .topnav-link {
    padding: 5px 10px; border-radius: 5px;
    font-size: 13px; font-weight: 500; color: var(--ink-3);
    text-decoration: none; white-space: nowrap;
  }
  .topnav-link.active { background: var(--bg); color: var(--ink); }
  .topnav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: #E4E4E7; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: var(--ink-2);
  }
  .icon-btn {
    width: 30px; height: 30px; border-radius: 5px; background: none; border: none;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    color: var(--ink-3);
  }
  .body { display: flex; flex: 1; overflow: hidden; }
  .sidebar {
    width: 208px; background: var(--surface); border-right: 1px solid var(--border);
    padding: 12px 8px; display: flex; flex-direction: column; gap: 1px; flex-shrink: 0;
  }
  .nav-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px; border-radius: 5px;
    font-size: 13px; font-weight: 500; color: var(--ink-3); cursor: pointer;
    text-decoration: none;
  }
  .nav-item.active { background: var(--bg); color: var(--ink); }
  .nav-icon { font-size: 14px; opacity: 0.75; }
  .nav-badge {
    margin-left: auto; background: var(--crit-bg); color: var(--crit);
    font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 99px;
    border: 1px solid var(--crit-border);
  }
  .nav-section {
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink-4); padding: 10px 10px 4px;
  }
  .main { flex: 1; overflow-y: auto; padding: 28px 32px; }
  /* Page header */
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .page-title { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); }
  .page-sub { font-size: 12px; color: var(--ink-3); margin-top: 2px; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--radius); font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1px solid transparent;
  }
  .btn-primary { background: var(--ink); color: #fff; }
  .btn-secondary { background: var(--surface); color: var(--ink-2); border-color: var(--border-2); }
  /* Filter tabs */
  .filter-tabs { display: flex; gap: 2px; margin-bottom: 16px; padding: 3px; background: var(--bg); border: 1px solid var(--border); border-radius: 7px; width: fit-content; }
  .tab { padding: 5px 12px; border-radius: 5px; font-size: 12px; font-weight: 500; color: var(--ink-3); cursor: pointer; white-space: nowrap; }
  .tab.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }
  .tab-count { margin-left: 4px; color: var(--ink-4); }
  /* Table */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow); }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 10px 16px; text-align: left;
    font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--ink-4); background: var(--bg); border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  tbody tr { border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #FAFAFA; }
  tbody td { padding: 13px 16px; vertical-align: middle; }
  .company-name { font-size: 13px; font-weight: 500; color: var(--ink); }
  .company-meta { font-size: 11px; color: var(--ink-4); margin-top: 1px; }
  /* Tier badge */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 99px; font-size: 11px; font-weight: 600;
    letter-spacing: 0.02em; white-space: nowrap; border: 1px solid;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; }
  .badge-crit  { background: var(--crit-bg);  color: var(--crit);  border-color: var(--crit-border); }
  .badge-risk  { background: var(--risk-bg);  color: var(--risk);  border-color: var(--risk-border); }
  .badge-med   { background: var(--med-bg);   color: var(--med);   border-color: var(--med-border);  }
  .badge-low   { background: var(--low-bg);   color: var(--low);   border-color: var(--low-border);  }
  /* Signal cell */
  .signal { font-size: 12px; color: var(--ink-2); }
  .signal-label { font-size: 11px; color: var(--ink-4); margin-top: 1px; }
  /* Last activity */
  .last-act { font-size: 12px; color: var(--ink-3); white-space: nowrap; }
  .last-act-warn { color: var(--crit); font-weight: 500; }
  /* CSM pill */
  .csm { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-2); }
  .csm-avatar { width: 22px; height: 22px; border-radius: 50%; background: var(--border); font-size: 9px; font-weight: 600; display: flex; align-items: center; justify-content: center; color: var(--ink-3); }
  /* Action link */
  .action-link { font-size: 12px; color: var(--accent); font-weight: 500; }
  /* Summary section */
  .section-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 8px; }
  .summary-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 20px 22px; margin-bottom: 20px; box-shadow: var(--shadow); }
  .summary-card p { font-size: 13.5px; line-height: 1.7; color: var(--ink-2); }
  .signal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .signal-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px 18px; box-shadow: var(--shadow); }
  .signal-card-label { font-size: 11px; font-weight: 600; color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .signal-card-value { font-size: 22px; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); margin-bottom: 4px; }
  .signal-card-sub { font-size: 12px; color: var(--ink-3); }
  .signal-card-badge { display: inline-flex; margin-top: 10px; }
  .action-card { background: var(--accent-s); border: 1px solid #BFDBFE; border-radius: 8px; padding: 18px 22px; }
  .action-card-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .action-card p { font-size: 13px; line-height: 1.65; color: #1E40AF; }
  /* Breadcrumb */
  .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--ink-4); margin-bottom: 16px; }
  .breadcrumb a { color: var(--ink-4); text-decoration: none; }
  .breadcrumb a:hover { color: var(--ink); }
  .breadcrumb-sep { color: var(--border-2); }
  .breadcrumb-current { color: var(--ink-2); font-weight: 500; }
  /* Account header */
  .acct-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
  .acct-icon { width: 44px; height: 44px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .acct-name { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); }
  .acct-meta { font-size: 12px; color: var(--ink-3); margin-top: 2px; }
  .acct-actions { margin-left: auto; display: flex; gap: 8px; }
  /* Two-col layout */
  .two-col { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
`;

function anseSidebar(activeItem = 'accounts') {
  return `
    <aside class="sidebar">
      <div class="nav-section">Overview</div>
      <a class="nav-item ${activeItem === 'dashboard' ? 'active' : ''}">
        <span class="nav-icon">▦</span> Dashboard
      </a>
      <a class="nav-item ${activeItem === 'accounts' ? 'active' : ''}">
        <span class="nav-icon">◉</span> Accounts
        <span class="nav-badge">4</span>
      </a>
      <a class="nav-item ${activeItem === 'signals' ? 'active' : ''}">
        <span class="nav-icon">⚡</span> Signals
      </a>
      <div class="nav-section" style="margin-top:8px">Playbooks</div>
      <a class="nav-item">
        <span class="nav-icon">▷</span> Re-engagement
      </a>
      <a class="nav-item">
        <span class="nav-icon">▷</span> QBR preparation
      </a>
      <a class="nav-item" style="margin-top:auto">
        <span class="nav-icon">⚙</span> Settings
      </a>
    </aside>`;
}

function anseTopnav() {
  return `
    <header class="topnav">
      <div class="topnav-logo">
        <div class="logo-mark">A</div>
        Anse
      </div>
      <nav class="topnav-links">
        <a class="topnav-link">Overview</a>
        <a class="topnav-link active">Accounts</a>
        <a class="topnav-link">Signals</a>
        <a class="topnav-link">Playbooks</a>
      </nav>
      <div class="topnav-right">
        <div class="icon-btn">🔔</div>
        <div class="avatar">SR</div>
      </div>
    </header>`;
}

function anseRiskListHTML() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
  <style>${ANSE_TOKENS}</style></head>
  <body>
  <div class="shell">
    ${anseTopnav()}
    <div class="body">
      <div class="main">
        <div class="page-header">
          <div>
            <div class="page-title">Accounts</div>
            <div class="page-sub">23 accounts · 4 need attention today</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary">⇩ Export</button>
            <button class="btn btn-primary">+ Add account</button>
          </div>
        </div>

        <div class="filter-tabs">
          <div class="tab active">All <span class="tab-count">23</span></div>
          <div class="tab">Critical <span class="tab-count" style="color:var(--crit)">1</span></div>
          <div class="tab">At Risk <span class="tab-count" style="color:var(--risk)">3</span></div>
          <div class="tab">Medium <span class="tab-count">5</span></div>
          <div class="tab">Low <span class="tab-count">14</span></div>
        </div>

        <div class="card">
          <table>
            <thead>
              <tr>
                <th style="width:26%">Company</th>
                <th style="width:13%">Risk tier</th>
                <th style="width:27%">Primary signal</th>
                <th style="width:15%">Last activity</th>
                <th style="width:12%">CSM</th>
                <th style="width:7%"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="company-name">Meridian Analytics</div>
                  <div class="company-meta">Enterprise · 340 seats</div>
                </td>
                <td><span class="badge badge-crit"><span class="badge-dot" style="background:var(--crit)"></span>Critical</span></td>
                <td>
                  <div class="signal">No login in 18 days</div>
                  <div class="signal-label">Feature adoption dropped to 0%</div>
                </td>
                <td><span class="last-act last-act-warn">18 days ago</span></td>
                <td><div class="csm"><div class="csm-avatar">SR</div> Sarah R.</div></td>
                <td><a class="action-link">Review →</a></td>
              </tr>
              <tr>
                <td>
                  <div class="company-name">Cascade Systems</div>
                  <div class="company-meta">Growth · 85 seats</div>
                </td>
                <td><span class="badge badge-risk"><span class="badge-dot" style="background:var(--risk)"></span>At Risk</span></td>
                <td>
                  <div class="signal">Support tickets ↑ 3× this month</div>
                  <div class="signal-label">Core feature adoption low</div>
                </td>
                <td><span class="last-act">9 days ago</span></td>
                <td><div class="csm"><div class="csm-avatar">ML</div> Marcus L.</div></td>
                <td><a class="action-link">Review →</a></td>
              </tr>
              <tr>
                <td>
                  <div class="company-name">Northfield Capital</div>
                  <div class="company-meta">Enterprise · 210 seats</div>
                </td>
                <td><span class="badge badge-risk"><span class="badge-dot" style="background:var(--risk)"></span>At Risk</span></td>
                <td>
                  <div class="signal">Usage down 40% over 30 days</div>
                  <div class="signal-label">Last QBR: 94 days ago</div>
                </td>
                <td><span class="last-act">6 days ago</span></td>
                <td><div class="csm"><div class="csm-avatar">SR</div> Sarah R.</div></td>
                <td><a class="action-link">Review →</a></td>
              </tr>
              <tr>
                <td>
                  <div class="company-name">Vertex Software</div>
                  <div class="company-meta">Growth · 62 seats</div>
                </td>
                <td><span class="badge badge-med"><span class="badge-dot" style="background:var(--med)"></span>Medium</span></td>
                <td>
                  <div class="signal">Champion left company</div>
                  <div class="signal-label">No replacement identified</div>
                </td>
                <td><span class="last-act">4 days ago</span></td>
                <td><div class="csm"><div class="csm-avatar">ML</div> Marcus L.</div></td>
                <td><a class="action-link">Review →</a></td>
              </tr>
              <tr>
                <td>
                  <div class="company-name">Brightfield Labs</div>
                  <div class="company-meta">Startup · 28 seats</div>
                </td>
                <td><span class="badge badge-med"><span class="badge-dot" style="background:var(--med)"></span>Medium</span></td>
                <td>
                  <div class="signal">Login frequency declining</div>
                  <div class="signal-label">Down from 4.2 to 1.8 sessions/week</div>
                </td>
                <td><span class="last-act">2 days ago</span></td>
                <td><div class="csm"><div class="csm-avatar">SR</div> Sarah R.</div></td>
                <td><a class="action-link">Review →</a></td>
              </tr>
              <tr>
                <td>
                  <div class="company-name">Sagewell Partners</div>
                  <div class="company-meta">Enterprise · 175 seats</div>
                </td>
                <td><span class="badge badge-low"><span class="badge-dot" style="background:var(--low)"></span>Low</span></td>
                <td>
                  <div class="signal">Healthy — usage stable</div>
                  <div class="signal-label">QBR scheduled for next week</div>
                </td>
                <td><span class="last-act">Today</span></td>
                <td><div class="csm"><div class="csm-avatar">ML</div> Marcus L.</div></td>
                <td><a class="action-link">View →</a></td>
              </tr>
              <tr>
                <td>
                  <div class="company-name">Ironbridge Co.</div>
                  <div class="company-meta">Growth · 44 seats</div>
                </td>
                <td><span class="badge badge-low"><span class="badge-dot" style="background:var(--low)"></span>Low</span></td>
                <td>
                  <div class="signal">Strong feature adoption</div>
                  <div class="signal-label">Active power user identified</div>
                </td>
                <td><span class="last-act">Yesterday</span></td>
                <td><div class="csm"><div class="csm-avatar">SR</div> Sarah R.</div></td>
                <td><a class="action-link">View →</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  </body></html>`;
}

function anseAccountDetailHTML() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
  <style>${ANSE_TOKENS}</style></head>
  <body>
  <div class="shell">
    ${anseTopnav()}
    <div class="body">
      <div class="main">
        <div class="breadcrumb">
          <a>Accounts</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Meridian Analytics</span>
        </div>

        <div class="acct-header">
          <div class="acct-icon">📊</div>
          <div>
            <div class="acct-name">Meridian Analytics</div>
            <div class="acct-meta">Enterprise · 340 seats · CSM: Sarah R. · Renewal: Sep 2025</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;margin-left:auto">
            <span class="badge badge-crit" style="font-size:12px;padding:4px 10px">
              <span class="badge-dot" style="background:var(--crit)"></span>Critical
            </span>
            <button class="btn btn-secondary">📧 Draft email</button>
            <button class="btn btn-primary">Log interaction</button>
          </div>
        </div>

        <div class="two-col">
          <div>
            <div class="section-label" style="margin-bottom:10px">AI health summary</div>
            <div class="summary-card" style="margin-bottom:20px">
              <p>Meridian Analytics has not logged in for 18 days — longer than any prior gap in the past six months. Their adoption of the reporting module, which was their stated primary use case at onboarding, has dropped from weekly to zero over the last 30 days. They submitted three support tickets in the past two weeks after none in the prior two months, suggesting they hit friction and disengaged rather than resolving it.</p>
              <p style="margin-top:12px">The last recorded touchpoint was a QBR in March — now 94 days ago. There is no active champion interaction on record since then. Based on this pattern, the account is either evaluating alternatives or has already made a decision. The renewal window opens in 11 weeks.</p>
            </div>

            <div class="section-label" style="margin-bottom:10px">Signal breakdown</div>
            <div class="signal-grid">
              <div class="signal-card">
                <div class="signal-card-label">Login frequency</div>
                <div class="signal-card-value">0</div>
                <div class="signal-card-sub">Sessions in last 18 days</div>
                <div class="signal-card-badge">
                  <span class="badge badge-crit"><span class="badge-dot" style="background:var(--crit)"></span>Critical</span>
                </div>
              </div>
              <div class="signal-card">
                <div class="signal-card-label">Feature adoption</div>
                <div class="signal-card-value">0%</div>
                <div class="signal-card-sub">Core features used this month</div>
                <div class="signal-card-badge">
                  <span class="badge badge-crit"><span class="badge-dot" style="background:var(--crit)"></span>Critical</span>
                </div>
              </div>
              <div class="signal-card">
                <div class="signal-card-label">Support tickets</div>
                <div class="signal-card-value">3</div>
                <div class="signal-card-sub">In last 14 days · ↑ from 0</div>
                <div class="signal-card-badge">
                  <span class="badge badge-risk"><span class="badge-dot" style="background:var(--risk)"></span>At Risk</span>
                </div>
              </div>
              <div class="signal-card">
                <div class="signal-card-label">Last interaction</div>
                <div class="signal-card-value">94d</div>
                <div class="signal-card-sub">QBR on 7 March 2025</div>
                <div class="signal-card-badge">
                  <span class="badge badge-risk"><span class="badge-dot" style="background:var(--risk)"></span>At Risk</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="section-label" style="margin-bottom:10px">Suggested action</div>
            <div class="action-card">
              <div class="action-card-label">⚡ Anse recommends</div>
              <p>Request a short 20-minute check-in call this week. Lead with the support tickets — ask whether the friction was resolved. If no response within 48 hours, loop in the account executive and prepare a renewal risk brief.</p>
              <div style="margin-top:14px;display:flex;gap:8px">
                <button class="btn btn-primary" style="font-size:12px;padding:6px 12px;background:#2563EB">Draft email</button>
                <button class="btn btn-secondary" style="font-size:12px;padding:6px 12px">Log as done</button>
              </div>
            </div>

            <div style="margin-top:20px">
              <div class="section-label" style="margin-bottom:10px">Recent activity</div>
              <div class="card" style="padding:0">
                <div style="padding:14px 16px;border-bottom:1px solid var(--border)">
                  <div style="font-size:12px;color:var(--ink);font-weight:500">Support ticket #3491</div>
                  <div style="font-size:11px;color:var(--ink-4);margin-top:2px">"Report export failing for large date ranges" · 3 days ago</div>
                </div>
                <div style="padding:14px 16px;border-bottom:1px solid var(--border)">
                  <div style="font-size:12px;color:var(--ink);font-weight:500">Support ticket #3448</div>
                  <div style="font-size:11px;color:var(--ink-4);margin-top:2px">"Dashboard loading slowly" · 8 days ago</div>
                </div>
                <div style="padding:14px 16px">
                  <div style="font-size:12px;color:var(--ink);font-weight:500">QBR call — Sarah R.</div>
                  <div style="font-size:11px;color:var(--ink-4);margin-top:2px">Positive sentiment. Expansion discussed. · 94 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  </body></html>`;
}

async function captureAnse(browser) {
  console.log('\n── Anse ─────────────────────────────────────────────────────');
  console.log(`   Method    : HTML mockup via page.setContent() — no server needed`);
  console.log(`   Viewport  : ${ANSE_VIEWPORT.width}×${ANSE_VIEWPORT.height} @${ANSE_SCALE}x\n`);

  const outDir = path.join(PUBLIC_DIR, 'anse');
  ensureDir(outDir);

  // ── hero + screen-1: account risk list ───────────────────────────────────
  for (const [filename, label] of [['hero.png', 'hero'], ['screen-1.png', 'screen-1']]) {
    const ctx = await browser.newContext({
      viewport: ANSE_VIEWPORT,
      deviceScaleFactor: ANSE_SCALE,
    });
    const page = await ctx.newPage();
    await page.setContent(anseRiskListHTML(), { waitUntil: 'domcontentloaded' });
    await wait(300);
    await page.screenshot({ path: path.join(outDir, filename), animations: 'disabled' });
    console.log(`  ✓  public/images/anse/${filename}`);
    await ctx.close();
  }

  // ── screen-2: account detail ──────────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: ANSE_VIEWPORT,
      deviceScaleFactor: ANSE_SCALE,
    });
    const page = await ctx.newPage();
    await page.setContent(anseAccountDetailHTML(), { waitUntil: 'domcontentloaded' });
    await wait(300);
    await page.screenshot({ path: path.join(outDir, 'screen-2.png'), animations: 'disabled' });
    console.log(`  ✓  public/images/anse/screen-2.png`);
    await ctx.close();
  }

  console.log(`\n  3 screenshots saved → public/images/anse/`);
  console.log('  No server required — HTML mockup rendered directly by Playwright.\n');
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

const PROJECTS = { tovi: captureTovi, alune: captureAlune, anse: captureAnse };

async function main() {
  const target = process.argv[2] ?? 'all';

  const toRun =
    target === 'all'
      ? Object.entries(PROJECTS)
      : Object.entries(PROJECTS).filter(([k]) => k === target);

  if (toRun.length === 0) {
    console.error(`\nUnknown project: "${target}". Available: ${Object.keys(PROJECTS).join(', ')}, all`);
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });

  try {
    for (const [, fn] of toRun) {
      await fn(browser);
    }
  } finally {
    await browser.close();
  }

  console.log('All captures complete. Commit public/images/ to deploy to Vercel.\n');
}

main().catch((err) => {
  console.error('\nCapture failed:', err.message);
  process.exit(1);
});
