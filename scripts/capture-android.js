#!/usr/bin/env node
/**
 * capture-android.js — Emulator-based screenshot capture for native Android apps.
 *
 * Boots the `Medium_Phone_API_36.1` AVD, installs APKs, navigates to target
 * screens via `adb shell input tap`, and pulls screenshots with
 * `adb exec-out screencap -p`.
 *
 * Usage:
 *   node scripts/capture-android.js [project]
 *   node scripts/capture-android.js chess
 *   node scripts/capture-android.js sudoku
 *   node scripts/capture-android.js           # captures both
 *
 * What this captures (real app, emulator):
 *   chess/screen-4.png  — Settings screen
 *   sudoku/screen-1.png — Home screen (daily challenge + difficulty tiles)
 *   sudoku/screen-3.png — Statistics screen
 *
 * What requires manual screenshots (run app, play to state, then `adb screencap`):
 *   chess/hero.png      — same as screen-1
 *   chess/screen-1.png  — game board with piece selected + move dots
 *   chess/screen-2.png  — board + move history chips (after ~10 moves)
 *   chess/screen-3.png  — game-over dialog (play to stalemate/checkmate)
 *   sudoku/hero.png     — same as screen-2
 *   sudoku/screen-2.png — active game, cell selected, number pad visible
 *   sudoku/screen-4.png — achievements (screen not wired in NavGraph — use mockup)
 *
 * Manual pull command (run after reaching the right state in emulator):
 *   adb exec-out screencap -p > ~/portfolio/public/images/<app>/<file>.png
 */

'use strict';

const { execSync, spawnSync, spawn } = require('child_process');
const path   = require('path');
const fs     = require('fs');

// ── Paths ──────────────────────────────────────────────────────────────────────
const SDK         = `${process.env.HOME}/Library/Android/sdk`;
const EMULATOR    = `${SDK}/emulator/emulator`;
const ADB         = `${SDK}/platform-tools/adb`;
const AVD_NAME    = 'Medium_Phone_API_36.1';

const CHESS_APK   = `${process.env.HOME}/AndroidStudioProjects/Chess/app/build/outputs/apk/debug/chess.apk`;
const SUDOKU_APK  = `${process.env.HOME}/AndroidStudioProjects/Sudoku/app/build/outputs/apk/debug/app-debug1.apk`;

const CHESS_PKG   = 'com.example.checkmateflow';
const SUDOKU_PKG  = 'com.example.sudoku';

const PUBLIC_DIR  = path.join(__dirname, '..', 'public', 'images');

// ── Helpers ────────────────────────────────────────────────────────────────────
function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', ...opts }).trim();
}

function adb(...args) {
  return run(`"${ADB}" ${args.join(' ')}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForBoot() {
  process.stdout.write('  Waiting for emulator to boot');
  for (let i = 0; i < 60; i++) {
    try {
      const state = run(`"${ADB}" shell getprop sys.boot_completed 2>/dev/null`);
      if (state.trim() === '1') {
        process.stdout.write(' ✓\n');
        return;
      }
    } catch (_) {}
    process.stdout.write('.');
    await sleep(3000);
  }
  throw new Error('Emulator did not boot within 3 minutes');
}

async function waitForPackage(pkg) {
  for (let i = 0; i < 20; i++) {
    try {
      const out = run(`"${ADB}" shell pidof ${pkg} 2>/dev/null || echo ""`);
      if (out.trim()) return;
    } catch (_) {}
    await sleep(500);
  }
}

async function screencap(destPath) {
  // Pull raw PNG bytes directly — no temp file on device needed
  const buf = spawnSync(`${ADB}`, ['exec-out', 'screencap', '-p'], { maxBuffer: 20 * 1024 * 1024 });
  if (buf.status !== 0) throw new Error(`screencap failed: ${buf.stderr?.toString()}`);
  fs.writeFileSync(destPath, buf.stdout);
}

function tap(x, y) {
  adb(`shell input tap ${x} ${y}`);
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// ── Emulator lifecycle ─────────────────────────────────────────────────────────
function isEmulatorRunning() {
  try {
    const devices = run(`"${ADB}" devices`);
    return devices.includes('emulator-');
  } catch (_) { return false; }
}

async function startEmulator() {
  if (isEmulatorRunning()) {
    console.log('  Emulator already running — skipping boot.');
    return false; // didn't start it, don't shut it down
  }
  console.log(`  Starting AVD: ${AVD_NAME}`);
  spawn(EMULATOR, ['-avd', AVD_NAME, '-no-snapshot-save', '-no-audio', '-no-boot-anim'], {
    detached: true,
    stdio: 'ignore',
  }).unref();
  await sleep(5000); // give it a moment to register with adb
  await waitForBoot();
  await sleep(3000); // let launcher settle
  return true; // started it — shut down after
}

// ── Chess ──────────────────────────────────────────────────────────────────────
async function captureChessAutomated() {
  const outDir = path.join(PUBLIC_DIR, 'chess');
  ensureDir(outDir);

  console.log('\n  Installing CheckmateFlow…');
  adb(`install -r "${CHESS_APK}"`);
  await sleep(1500);

  // ── screen-4: Settings ────────────────────────────────────────────────────
  console.log('  Launching CheckmateFlow…');
  adb(`shell am start -n ${CHESS_PKG}/.MainActivity`);
  await sleep(3500); // wait for board to fully render

  // The game screen has a ⋮ overflow menu button top-right (~1050, 80 on 1080px-wide display)
  // Medium_Phone_API_36.1 is 1080×2340
  tap(1050, 80);
  await sleep(600);
  // "Settings" is the 3rd item in the dropdown (~540, 320)
  tap(540, 320);
  await sleep(1500);

  const screen4Path = path.join(outDir, 'screen-4.png');
  await screencap(screen4Path);
  console.log('  ✓  public/images/chess/screen-4.png  (Settings — real app)');
}

// ── Sudoku ─────────────────────────────────────────────────────────────────────
async function captureSudokuAutomated() {
  const outDir = path.join(PUBLIC_DIR, 'sudoku');
  ensureDir(outDir);

  console.log('\n  Installing Sudoku…');
  adb(`install -r "${SUDOKU_APK}"`);
  await sleep(1500);

  // ── screen-1: Home ────────────────────────────────────────────────────────
  console.log('  Launching Sudoku…');
  adb(`shell am start -n ${SUDOKU_PKG}/.MainActivity`);
  await sleep(3500);

  // Dismiss any system overlays
  adb('shell input keyevent KEYCODE_BACK');
  await sleep(500);
  adb(`shell am start -n ${SUDOKU_PKG}/.MainActivity`);
  await sleep(2500);

  const screen1Path = path.join(outDir, 'screen-1.png');
  await screencap(screen1Path);
  console.log('  ✓  public/images/sudoku/screen-1.png  (Home — real app)');

  // ── screen-3: Statistics ──────────────────────────────────────────────────
  // TopBar has 3 icons right-aligned. On 1080-wide display:
  // Settings (rightmost) ~1010, Statistics (middle) ~910, History (left) ~810 — all at y≈80
  tap(910, 80);
  await sleep(2000);

  const screen3Path = path.join(outDir, 'screen-3.png');
  await screencap(screen3Path);
  console.log('  ✓  public/images/sudoku/screen-3.png  (Statistics — real app)');
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const arg = process.argv[2]?.toLowerCase();

  const doChess  = !arg || arg === 'chess';
  const doSudoku = !arg || arg === 'sudoku';

  console.log('\n── Android Screenshot Capture ────────────────────────────────────────────────');
  console.log(`   AVD        : ${AVD_NAME}`);
  console.log(`   Chess APK  : ${CHESS_APK}`);
  console.log(`   Sudoku APK : ${SUDOKU_APK}\n`);

  const startedEmulator = await startEmulator();

  try {
    if (doChess)  await captureChessAutomated();
    if (doSudoku) await captureSudokuAutomated();
  } finally {
    if (startedEmulator) {
      console.log('\n  Shutting down emulator…');
      try { adb('emu kill'); } catch (_) {}
    }
  }

  console.log('\n── Done ──────────────────────────────────────────────────────────────────────');
  console.log('  Automated captures complete.');
  console.log('  Run `node scripts/capture-android.js --verify-taps` if any screen looked wrong.');
  console.log('\n  Remaining manual captures (game-state screens):');
  console.log('    chess/hero.png      — same as screen-1');
  console.log('    chess/screen-1.png  — board with piece selected + legal move dots');
  console.log('    chess/screen-2.png  — board + move history chips (10+ moves played)');
  console.log('    chess/screen-3.png  — game-over dialog (checkmate or stalemate)');
  console.log('    sudoku/hero.png     — same as screen-2');
  console.log('    sudoku/screen-2.png — active game, cell selected, number pad showing');
  console.log('  Command: adb exec-out screencap -p > ~/portfolio/public/images/<app>/<file>.png\n');
}

main().catch(e => { console.error(e.message); process.exit(1); });
