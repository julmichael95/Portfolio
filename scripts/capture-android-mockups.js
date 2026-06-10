#!/usr/bin/env node
/**
 * capture-android-mockups.js
 *
 * Generates pixel-accurate HTML mockups of game-state screens that cannot be
 * captured automatically (require live gameplay or are unreachable in the nav
 * graph). Uses Playwright page.setContent() — no emulator, no server.
 *
 * All colours, layout, and component structure are derived directly from the
 * actual Kotlin source files in ~/AndroidStudioProjects/{Chess,Sudoku}/.
 *
 * Usage:
 *   node scripts/capture-android-mockups.js [project]
 *   node scripts/capture-android-mockups.js chess
 *   node scripts/capture-android-mockups.js sudoku
 *
 * Outputs (placeholders — replace with real adb screencaps when available):
 *   public/images/chess/hero.png      (same source as screen-1)
 *   public/images/chess/screen-1.png  game board, piece selected, move dots
 *   public/images/chess/screen-2.png  board + move history chip row
 *   public/images/chess/screen-3.png  game-over overlay (stalemate)
 *   public/images/sudoku/hero.png     (same source as screen-2)
 *   public/images/sudoku/screen-2.png active game, cell selected, number pad
 *   public/images/sudoku/screen-4.png achievements screen (not in NavGraph)
 */

'use strict';
const { chromium } = require('@playwright/test');
const path  = require('path');
const fs    = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');

// Android medium phone: 1080×2340 @2.625 density → render at 390×844 @3x
const VIEWPORT = { width: 390, height: 844 };
const SCALE    = 3;

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
const wait = ms => new Promise(r => setTimeout(r, ms));

// ── Shared design tokens (from Color.kt) ──────────────────────────────────────
// Chess: MD3 light scheme, warm navy/forest primary
const CHESS_CSS = `
  :root {
    --bg:         #FDFBF7;
    --surface:    #FDFBF7;
    --surf-var:   #E3E0D8;
    --on-surf:    #1C1B17;
    --on-sv:      #45443C;
    --outline:    #76746D;
    --outline-v:  #C7C5BD;
    --primary:    #1565C0;
    --pri-cont:   #D3E4FF;
    --on-pri-c:   #001C3D;
    --error:      #D32F2F;
    /* Board */
    --board-dark:  #4A3728;
    --board-light: #F5EDD6;
    --sel:         rgba(0,200,83,0.80);
    --sel-dot:     rgba(0,200,83,0.55);
    --last:        rgba(25,118,210,0.35);
    --check:       rgba(211,47,47,0.70);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 390px; height: 844px; overflow: hidden; }
  body {
    font-family: 'Roboto', -apple-system, sans-serif;
    font-size: 14px; background: var(--bg); color: var(--on-surf);
    -webkit-font-smoothing: antialiased;
  }
  .screen { display: flex; flex-direction: column; height: 844px; }
  /* Top bar */
  .topbar {
    height: 56px; background: var(--surface); display: flex; align-items: center;
    padding: 0 4px 0 16px; border-bottom: 1px solid var(--outline-v);
    flex-shrink: 0;
  }
  .topbar-title {
    flex: 1; text-align: center; font-size: 20px; font-weight: 700;
    letter-spacing: -0.02em; color: var(--on-surf);
  }
  .icon-btn {
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; font-size: 20px; color: var(--on-sv); flex-shrink: 0;
  }
  /* Board */
  .board-wrapper {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: var(--bg); padding: 12px;
  }
  .board-frame {
    width: 100%; aspect-ratio: 1/1;
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    background: #2B2B2B;
    padding: 4px;
  }
  .board-inner { width: 100%; height: 100%; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
  .board-row { display: flex; flex: 1; }
  .sq {
    flex: 1; display: flex; align-items: center; justify-content: center;
    position: relative; font-size: 28px; line-height: 1; user-select: none;
  }
  .sq.dark  { background: var(--board-dark); }
  .sq.light { background: var(--board-light); }
  .sq.sel   { background: var(--sel) !important; }
  .sq.last  { background: var(--last) !important; }
  .sq.check { background: var(--check) !important; }
  .dot {
    position: absolute; width: 13px; height: 13px; border-radius: 50%;
    background: var(--sel-dot); pointer-events: none;
  }
  .piece-w { color: #FFFFFF; text-shadow: 1.5px 1.5px 3px rgba(0,0,0,0.55); }
  .piece-b { color: #1A1A1A; text-shadow: 1.5px 1.5px 3px rgba(255,255,255,0.35); }
  .coord-rank {
    position: absolute; top: 2px; left: 3px; font-size: 7px; font-weight: 500;
    color: rgba(255,255,255,0.30);
  }
  .coord-file {
    position: absolute; bottom: 2px; right: 3px; font-size: 7px; font-weight: 500;
    color: rgba(255,255,255,0.30);
  }
  .dark .coord-rank, .dark .coord-file { color: rgba(255,255,255,0.30); }
  .light .coord-rank, .light .coord-file { color: rgba(0,0,0,0.30); }
  /* Status bottom panel */
  .status-panel {
    background: var(--surf-var); border-radius: 24px 24px 0 0;
    padding: 16px 24px 24px;
    flex-shrink: 0;
  }
  .status-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .turn-dot {
    width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
    border: 1px solid var(--outline);
  }
  .status-text { font-size: 18px; font-weight: 700; color: var(--on-sv); }
  .moves-label {
    font-size: 11px; font-weight: 800; letter-spacing: 2px; color: rgba(69,68,60,0.6);
    margin-bottom: 8px;
  }
  .chip-row { display: flex; gap: 8px; overflow: hidden; flex-wrap: nowrap; }
  .chip {
    padding: 5px 10px; border-radius: 8px; font-size: 13px; font-weight: 400;
    background: var(--surface); border: 1px solid var(--outline-v); white-space: nowrap;
    color: var(--on-surf);
  }
  .chip.latest {
    background: var(--pri-cont); border: none;
    color: var(--on-pri-c); font-weight: 600;
  }
  /* Game over overlay */
  .gameover-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.45); border-radius: 8px;
    pointer-events: none; z-index: 2;
  }
  .gameover-content { display: flex; flex-direction: column; gap: 14px; }
  .gameover-text { font-size: 22px; font-weight: 700; color: var(--on-sv); }
  .play-again-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--primary); color: #fff;
    padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600;
    width: fit-content;
  }
  .divider { height: 1px; background: rgba(199,197,189,0.5); margin: 12px 0; }
`;

// Sudoku tokens (Zen Modernist palette from Color.kt)
const SUDOKU_CSS = `
  :root {
    --bg:       #FDFCF4;
    --surface:  #FDFCF4;
    --surf-v:   #E4E4D6;
    --on-surf:  #1B1C17;
    --on-sv:    #46483C;
    --outline:  #77786B;
    --outline-v: rgba(119,120,107,0.3);
    --primary:  #566246;
    --pri-cont: #D9E7CB;
    --on-pc:    #141E09;
    --sec-cont: #E2E4D1;
    --error:    #BA1A1A;
    --success:  #386B01;
    --hi-wash:  rgba(86,98,70,0.10);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 390px; height: 844px; overflow: hidden; }
  body {
    font-family: 'Roboto', -apple-system, sans-serif;
    font-size: 14px; background: var(--bg); color: var(--on-surf);
    -webkit-font-smoothing: antialiased;
  }
  .screen { display: flex; flex-direction: column; height: 844px; }
  .topbar {
    height: 56px; background: transparent; display: flex; align-items: center;
    padding: 0 4px; flex-shrink: 0;
  }
  .topbar-title {
    flex: 1; text-align: center; font-size: 12px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--on-surf);
  }
  .icon-btn {
    width: 40px; height: 40px; display: flex; align-items: center;
    justify-content: center; border-radius: 50%; font-size: 18px; color: var(--on-sv);
  }
  /* Sudoku board */
  .sudoku-board {
    border: 1px solid var(--outline-v);
    border-radius: 4px; overflow: hidden;
    background: rgba(119,120,107,0.20);
    display: flex; flex-direction: column;
    gap: 1.5px; padding: 1px;
    aspect-ratio: 1/1;
  }
  .block-row { display: flex; flex: 1; gap: 1.5px; }
  .block {
    flex: 1; background: rgba(119,120,107,0.20);
    display: flex; flex-direction: column; gap: 0.5px; padding: 1px;
  }
  .cell-row { display: flex; flex: 1; gap: 0.5px; }
  .cell {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: var(--surface); font-size: 13px; font-weight: 400;
    color: var(--on-surf); position: relative; border-radius: 1px;
  }
  .cell.given { font-weight: 500; color: var(--on-surf); }
  .cell.selected { background: var(--pri-cont); color: var(--on-pc); font-weight: 600; }
  .cell.highlighted { background: var(--hi-wash); }
  .cell.same-num { background: rgba(86,98,70,0.08); }
  .cell.user { color: var(--primary); font-weight: 500; }
  .cell.error { color: var(--error); }
  .cell.empty { color: transparent; }
  /* Number pad */
  .numpad {
    display: grid; grid-template-columns: repeat(9, 1fr);
    gap: 6px; padding: 0 8px;
  }
  .num-key {
    height: 46px; display: flex; align-items: center; justify-content: center;
    background: var(--surface); border: 1px solid var(--outline-v);
    border-radius: 8px; font-size: 18px; font-weight: 500; color: var(--on-surf);
  }
  .num-key.used { opacity: 0.28; }
  /* Game header row */
  .game-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px 10px;
  }
  .game-stat { text-align: center; }
  .game-stat-val { font-size: 18px; font-weight: 600; color: var(--on-surf); }
  .game-stat-lbl { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(70,72,60,0.6); }
  .mistake-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin: 0 2px; }
  /* Action row */
  .action-row {
    display: flex; gap: 20px; justify-content: center; padding: 8px 0 12px;
  }
  .action-btn {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
    color: var(--on-sv);
  }
  .action-icon {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--surf-v); display: flex; align-items: center;
    justify-content: center; font-size: 18px;
  }
  /* Achievements */
  .achiev-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid var(--outline-v);
  }
  .achiev-icon {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .achiev-icon.unlocked { background: var(--pri-cont); }
  .achiev-icon.locked   { background: var(--surf-v); opacity: 0.5; }
  .achiev-title { font-size: 14px; font-weight: 600; color: var(--on-surf); }
  .achiev-desc  { font-size: 12px; color: rgba(70,72,60,0.7); margin-top: 2px; }
  .achiev-date  { font-size: 11px; color: var(--primary); margin-top: 2px; }
  /* Scrollable content */
  .scroll { flex: 1; overflow-y: auto; padding: 0 24px; }
`;

// ── Chess board data: starting position + 8 moves into a Ruy López ────────────
// Board is [rank8..rank1], each row [a..h]
// After: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6  (8 half-moves)
const CHESS_BOARD = [
  // rank 8
  ['♜','♞','♝','♛','♚','♝','·','♜'],
  // rank 7
  ['·','♟','♟','♟','·','♟','♟','♟'],
  // rank 6
  ['♟','·','♞','·','·','♞','·','·'],
  // rank 5
  ['·','·','·','·','♟','·','·','·'],
  // rank 4
  ['♗','·','·','·','♙','·','·','·'],
  // rank 3
  ['·','·','·','·','·','♘','·','·'],
  // rank 2
  ['♙','♙','♙','♙','·','♙','♙','♙'],
  // rank 1
  ['♖','♘','♝','♛','♔','·','·','♖'],
];

// Selected: white knight on f3 (file 5, rank 2 in 0-indexed from rank8)
// Legal destinations for Nf3: e1, g1, d4, h4, e5, g5, d2, h2
const SEL_ROW = 5, SEL_COL = 5; // rank3, f-file (0-indexed from top-left)
const LEGAL_DOTS = [
  [7,4],[7,6],   // e1, g1
  [4,3],[4,7],   // d4, h4
  [3,4],[3,6],   // e5 (capture), g5
  [6,3],[6,7],   // d2, h2
];
const LAST_FROM = [5, 5]; // Nf3 — same (this is the selected piece's current square, show it)
const LAST_TO_ROW = 5, LAST_TO_COL = 5;

// Piece color lookup (uppercase = white, ♙♖♘♗♛♔ = white, ♟♜♞♝♛♚ = black)
function isWhite(p) { return ['♙','♖','♘','♗','♛','♔'].includes(p); }
function isBlack(p) { return ['♟','♜','♞','♝','♛','♚'].includes(p); }

function chessBoard({ selected = true, gameover = false } = {}) {
  const files = ['a','b','c','d','e','f','g','h'];
  const ranks  = ['8','7','6','5','4','3','2','1'];

  let html = '';
  for (let r = 0; r < 8; r++) {
    html += '<div class="board-row">';
    for (let c = 0; c < 8; c++) {
      const isDark = (r + c) % 2 === 0;
      const piece  = CHESS_BOARD[r][c];
      const isSel  = selected && r === SEL_ROW && c === SEL_COL;
      const isLast = !selected && ((r === LAST_FROM[0] && c === LAST_FROM[1]));
      const isDot  = selected && LEGAL_DOTS.some(([dr,dc]) => dr === r && dc === c);
      // Capture ring for legal captures
      const isCaptureDot = isDot && piece !== '·';

      let cls = `sq ${isDark ? 'dark' : 'light'}`;
      if (isSel)  cls += ' sel';
      else if (isLast) cls += ' last';

      const rankLabel = c === 0 ? `<span class="coord-rank">${ranks[r]}</span>` : '';
      const fileLabel = r === 7 ? `<span class="coord-file">${files[c]}</span>` : '';
      const dot = isDot && !isCaptureDot ? `<div class="dot"></div>` : '';
      const capRing = isCaptureDot ? `<div style="position:absolute;width:32px;height:32px;border-radius:50%;border:3px solid rgba(0,200,83,0.75)"></div>` : '';

      let pieceHtml = '';
      if (piece !== '·') {
        const cls2 = isWhite(piece) ? 'piece-w' : 'piece-b';
        pieceHtml = `<span class="${cls2}">${piece}</span>`;
      }

      // game-over dim handled on the wrapper
      html += `<div class="${cls}">${rankLabel}${fileLabel}${dot}${capRing}${pieceHtml}</div>`;
    }
    html += '</div>';
  }
  return html;
}

const MOVES_8 = ['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6'];

function chessMoveChips(moves, latest) {
  return moves.map((m, i) => {
    const isLat = i === latest;
    return `<div class="chip${isLat ? ' latest' : ''}">${m}</div>`;
  }).join('');
}

// ── Chess screen HTML factories ────────────────────────────────────────────────
function chessGameHTML({ gameover = false } = {}) {
  const statusRow = gameover
    ? `<div class="gameover-content">
         <div class="gameover-text">Stalemate — Draw</div>
         <div class="play-again-btn">↺ Play Again</div>
       </div>`
    : `<div class="status-row">
         <div class="turn-dot" style="background:#1A1A1A;border-color:rgba(255,255,255,0.4)"></div>
         <div class="status-text">Black to move</div>
       </div>`;

  const moves = gameover ? [...MOVES_8,'Nxe5','d6','Nf3','Nxe4'] : MOVES_8;
  const latestIdx = moves.length - 1;

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>${CHESS_CSS}</style></head>
  <body><div class="screen">
    <div class="topbar">
      <div style="width:40px"></div>
      <div class="topbar-title">CheckmateFlow</div>
      <div class="icon-btn">⋮</div>
    </div>
    <div class="board-wrapper">
      <div class="board-frame">
        <div class="board-inner" style="position:relative">
          ${chessBoard({ selected: !gameover, gameover })}
          ${gameover ? '<div class="gameover-overlay"></div>' : ''}
        </div>
      </div>
    </div>
    <div class="status-panel">
      ${statusRow}
      <div class="divider"></div>
      <div class="moves-label">MOVES</div>
      <div class="chip-row">${chessMoveChips(moves, latestIdx)}</div>
    </div>
  </div></body></html>`;
}

// ── Sudoku board data ──────────────────────────────────────────────────────────
// A realistic Medium puzzle — 45 cells removed. G = given, U = user-filled, E = empty
// [value, type]  type: G=given, U=user, E=empty
const S = (v, t) => [v, t];
const G = v => S(v, 'G');
const U = v => S(v, 'U');
const E = () => S(0, 'E');

const SUDOKU_GRID = [
  [G(5),E(),E(),  G(2),E(),G(8),  E(),E(),G(3)],
  [E(),G(9),E(),  E(),E(),E(),  G(7),E(),E()],
  [E(),E(),G(1),  E(),G(7),E(),  E(),G(8),E()],

  [G(2),E(),G(4),  E(),E(),E(),  E(),E(),G(9)],
  [E(),E(),E(),  G(7),U(4),G(3),  E(),E(),E()],   // selected: r4,c4 (the 4)
  [G(1),E(),E(),  E(),E(),E(),  G(5),E(),G(7)],

  [E(),G(3),E(),  E(),G(6),E(),  G(4),E(),E()],
  [E(),E(),G(8),  E(),E(),E(),  E(),G(2),E()],
  [G(6),E(),E(),  G(3),E(),G(9),  E(),E(),G(5)],
];

const SEL_SUDOKU = [4, 4]; // row 4, col 4 — the user-filled 4

function sudokuBoardHTML(selRow, selCol) {
  // Highlight: same row, col, or 3×3 block; same number
  const selVal = SUDOKU_GRID[selRow]?.[selCol]?.[0] ?? 0;
  const selBlock = [Math.floor(selRow / 3), Math.floor(selCol / 3)];

  let out = '';
  for (let br = 0; br < 3; br++) {
    out += '<div class="block-row">';
    for (let bc = 0; bc < 3; bc++) {
      out += '<div class="block">';
      for (let ir = 0; ir < 3; ir++) {
        out += '<div class="cell-row">';
        for (let ic = 0; ic < 3; ic++) {
          const r = br * 3 + ir, c = bc * 3 + ic;
          const [v, t] = SUDOKU_GRID[r][c];
          const isSel = r === selRow && c === selCol;
          const isHi  = !isSel && (r === selRow || c === selCol || (Math.floor(r/3) === selBlock[0] && Math.floor(c/3) === selBlock[1]));
          const isSame = !isSel && v !== 0 && v === selVal;

          let cellCls = 'cell';
          if (isSel) cellCls += ' selected';
          else if (isSame) cellCls += ' same-num';
          else if (isHi) cellCls += ' highlighted';
          if (!isSel && t === 'U') cellCls += ' user';
          if (t === 'G') cellCls += ' given';

          out += `<div class="${cellCls}">${v || ''}</div>`;
        }
        out += '</div>';
      }
      out += '</div>';
    }
    out += '</div>';
  }
  return out;
}

function sudokuGameHTML() {
  const numpadKeys = [1,2,3,4,5,6,7,8,9];
  // Mark 9 as "used" (already placed in enough cells) to show the faded state
  const usedNums = new Set([9]);
  const numpadHTML = numpadKeys.map(n =>
    `<div class="num-key${usedNums.has(n) ? ' used' : ''}">${n}</div>`
  ).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>${SUDOKU_CSS}</style></head>
  <body><div class="screen">
    <div class="topbar">
      <div class="icon-btn">←</div>
      <div class="topbar-title">Medium</div>
      <div style="width:40px"></div>
    </div>

    <!-- Game stats row -->
    <div class="game-header">
      <div class="game-stat">
        <div class="game-stat-val">04:32</div>
        <div class="game-stat-lbl">Time</div>
      </div>
      <div class="game-stat">
        <div class="game-stat-val" style="display:flex;gap:3px;justify-content:center;align-items:center">
          <span class="mistake-dot" style="background:#BA1A1A"></span>
          <span class="mistake-dot" style="background:#E4E4D6"></span>
          <span class="mistake-dot" style="background:#E4E4D6"></span>
        </div>
        <div class="game-stat-lbl">Mistakes</div>
      </div>
      <div class="game-stat">
        <div class="game-stat-val">36</div>
        <div class="game-stat-lbl">Remaining</div>
      </div>
    </div>

    <!-- Board -->
    <div style="padding: 0 16px 12px">
      <div class="sudoku-board">${sudokuBoardHTML(...SEL_SUDOKU)}</div>
    </div>

    <!-- Action buttons -->
    <div class="action-row">
      <div class="action-btn">
        <div class="action-icon">↩</div>
        <span>Undo</span>
      </div>
      <div class="action-btn">
        <div class="action-icon">✏️</div>
        <span>Notes</span>
      </div>
      <div class="action-btn">
        <div class="action-icon">💡</div>
        <span>Hint</span>
      </div>
    </div>

    <!-- Number pad -->
    <div style="padding: 0 8px 20px">
      <div class="numpad">${numpadHTML}</div>
    </div>
  </div></body></html>`;
}

// ── Sudoku Achievements screen ─────────────────────────────────────────────────
// Defined in Achievement.kt — 8 achievements. Show 3 unlocked, 5 locked.
function sudokuAchievementsHTML() {
  const achievs = [
    { icon: '🏆', title: 'First Victory',   desc: 'Complete your first Sudoku puzzle',             unlocked: true,  date: 'Jun 2 · 2025' },
    { icon: '📅', title: 'Daily Pioneer',   desc: 'Complete your first Daily Challenge',           unlocked: true,  date: 'Jun 3 · 2025' },
    { icon: '🔥', title: 'Consistency',     desc: 'Maintain a 3-day daily challenge streak',       unlocked: true,  date: 'Jun 5 · 2025' },
    { icon: '⭐', title: 'Sudoku Master',   desc: 'Maintain a 7-day daily challenge streak',       unlocked: false, date: null },
    { icon: '🎯', title: 'Decathlon',       desc: 'Complete 10 Sudoku puzzles',                   unlocked: false, date: null },
    { icon: '✨', title: 'Perfectionist',   desc: 'Win 3 puzzles with zero mistakes',             unlocked: false, date: null },
    { icon: '🛡️', title: 'Veteran',         desc: 'Complete your first Hard Sudoku puzzle',       unlocked: false, date: null },
    { icon: '📆', title: 'Regular',         desc: 'Complete 5 Daily Challenges',                  unlocked: false, date: null },
  ];

  const items = achievs.map(a => `
    <div class="achiev-item">
      <div class="achiev-icon ${a.unlocked ? 'unlocked' : 'locked'}">${a.icon}</div>
      <div style="flex:1">
        <div class="achiev-title"${a.unlocked ? '' : ' style="opacity:0.5"'}>${a.title}</div>
        <div class="achiev-desc">${a.desc}</div>
        ${a.unlocked ? `<div class="achiev-date">Unlocked ${a.date}</div>` : ''}
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <style>${SUDOKU_CSS}
    .progress-bar-bg { height: 4px; background: var(--surf-v); border-radius: 99px; margin-bottom: 28px; }
    .progress-bar-fill { height: 4px; background: var(--primary); border-radius: 99px; width: 37.5%; }
  </style></head>
  <body><div class="screen">
    <div class="topbar">
      <div class="icon-btn">←</div>
      <div class="topbar-title">Achievements</div>
      <div style="width:40px"></div>
    </div>
    <div class="scroll">
      <div style="padding-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <span style="font-size:12px;color:var(--on-sv);opacity:0.7;letter-spacing:1.5px;text-transform:uppercase">Progress</span>
          <span style="font-size:13px;font-weight:600;color:var(--primary)">3 / 8</span>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill"></div></div>
        ${items}
      </div>
    </div>
  </div></body></html>`;
}

// ── Capture pipeline ───────────────────────────────────────────────────────────
async function captureChessMockups(browser) {
  const outDir = path.join(PUBLIC_DIR, 'chess');
  ensureDir(outDir);
  console.log('\n── Chess mockups ─────────────────────────────────────────────');

  const screens = [
    { files: ['hero.png', 'screen-1.png'], html: chessGameHTML({ gameover: false }), label: 'board, piece selected + move dots' },
    { files: ['screen-2.png'],             html: chessGameHTML({ gameover: false }), label: 'board + move history chips' },
    { files: ['screen-3.png'],             html: chessGameHTML({ gameover: true  }), label: 'game-over overlay (stalemate)' },
  ];

  for (const { files, html, label } of screens) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await wait(200);
    for (const file of files) {
      await page.screenshot({ path: path.join(outDir, file), animations: 'disabled', clip: { x: 0, y: 0, width: 390, height: 844 } });
      console.log(`  ✓  public/images/chess/${file}  [mockup — ${label}]`);
    }
    await ctx.close();
  }
}

async function captureSudokuMockups(browser) {
  const outDir = path.join(PUBLIC_DIR, 'sudoku');
  ensureDir(outDir);
  console.log('\n── Sudoku mockups ────────────────────────────────────────────');

  const screens = [
    { files: ['hero.png', 'screen-2.png'], html: sudokuGameHTML(),         label: 'active game, cell selected, number pad' },
    { files: ['screen-4.png'],             html: sudokuAchievementsHTML(), label: 'achievements (unreachable in NavGraph)' },
  ];

  for (const { files, html, label } of screens) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await wait(200);
    for (const file of files) {
      await page.screenshot({ path: path.join(outDir, file), animations: 'disabled', clip: { x: 0, y: 0, width: 390, height: 844 } });
      console.log(`  ✓  public/images/sudoku/${file}  [mockup — ${label}]`);
    }
    await ctx.close();
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const arg = process.argv[2]?.toLowerCase();
  const doChess  = !arg || arg === 'chess';
  const doSudoku = !arg || arg === 'sudoku';

  console.log('\n── Android placeholder mockups ───────────────────────────────────────────────');
  console.log('   Viewport: 390×844 @3x  (Android medium phone)');
  console.log('   Method  : Playwright page.setContent() — no emulator needed\n');

  const browser = await chromium.launch();
  try {
    if (doChess)  await captureChessMockups(browser);
    if (doSudoku) await captureSudokuMockups(browser);
  } finally {
    await browser.close();
  }

  console.log('\n  All mockups saved.');
  console.log('  Replace with real adb screenshots when ready.\n');
}

main().catch(e => { console.error(e.message); process.exit(1); });
