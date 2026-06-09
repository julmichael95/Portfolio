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

// ─── Dispatch ─────────────────────────────────────────────────────────────────

const PROJECTS = { tovi: captureTovi };

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
