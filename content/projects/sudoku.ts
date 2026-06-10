import type { Project } from "./_types";

const sudoku: Project = {
  slug: "sudoku",
  name: "Sudoku",
  tier: "experiment",
  status: "Shipped",
  categories: ["Mobile"],
  oneLiner: "A fast, clean Sudoku for Android. No ads, no dark patterns.",
  hook: "Most Sudoku apps are worse than the puzzle. This one isn't — four calibrated difficulties, a daily challenge, an achievement system, and a retention model built around the right things.",
  timeframe: "2025 · 1 week",
  role: "Solo",
  stack: ["Kotlin", "Jetpack Compose", "Android", "DataStore"],

  hero: {
    src: "/images/sudoku/hero.png",
    alt: "Sudoku Android app — active game board with number input pad",
    placeholder: "Sudoku — game board",
  },

  problem: [
    "Most Sudoku apps on Android are plastered with interstitial ads, push-notification dark patterns, and subscription gates for features that should be free. The puzzle itself — which is the entire product — ends up buried under monetisation friction. Building this from scratch was an exercise in removing everything that wasn't the game, and in designing the retention mechanics that good puzzle apps actually earn: daily challenges, streaks, and achievements tied to real skill milestones, not artificial progression gates.",
  ],
  solution: {
    body: [
      "A native Android Sudoku app built with Jetpack Compose, featuring procedurally generated puzzles across four calibrated difficulty levels: Easy (35 cells removed), Medium (45), Hard (52), and Expert (60). Every generated puzzle passes a uniqueness constraint — a backtracking solver verifies exactly one solution before the puzzle is presented. The generation pipeline runs off the main thread so puzzle load is imperceptible.",
      "The game layer is fully featured: an undo stack holds the full session history (Stack<SudokuUiState>), a three-mistake limit creates meaningful stakes without being punishing, and pause/resume handles interruptions cleanly. Number notes (pencil marks) are supported alongside direct cell entry. A custom number pad replaces the system keyboard for consistent input ergonomics.",
      "The retention system is where the real product thinking lives. A daily challenge resets at midnight and tracks completion streaks separately from regular play. Eight achievements map to concrete skill milestones: first win, first daily challenge, three-day and seven-day streaks, ten total wins, three no-mistake completions, a Hard puzzle win, and five daily challenge completions. A Statistics screen breaks down games started, won, and completed without mistakes per difficulty, plus best completion times and streak history. A RetentionManager coordinates achievement unlock checks and streak updates after every game completion.",
    ],
    decisions: [
      "Backtracking solver with a randomised seed over a pre-built puzzle library. Infinite unique puzzles with zero maintenance overhead — and the uniqueness check is a real constraint, not a heuristic.",
      "Undo stack rather than move history display. The UX goal was letting players explore without fear, not reviewing what they did. Unlimited undo within a session keeps the puzzle approachable; the three-mistake limit provides the tension that makes completion satisfying.",
      "Three-mistake limit over unlimited play. A hard limit that ends the session creates a meaningful difference between difficulty levels. Easy puzzles with 35 knowable cells feel genuinely easier than Expert with 60 — not just slower. The limit is communicated clearly at game start, not discovered on mistake three.",
      "Achievement milestones tied to skill, not time. All eight achievements require demonstrable game performance — no-mistake wins, Hard completions, streak maintenance. There's no 'play 30 days' achievement that rewards passive calendar behaviour.",
      "Daily challenge as a separate track. A single puzzle per day that everyone can compare keeps returning users engaged without requiring competitive infrastructure. The streak tracks daily challenge completions specifically, not total play — a meaningful distinction.",
      "Offline-first, no accounts. The constraint eliminates backend scope entirely and forces every retention feature to work from local state. DataStore persists all statistics, settings, achievements, and the current game across sessions with no network dependency.",
    ],
  },
  screens: [
    {
      src: "/images/sudoku/screen-1.png",
      alt: "Home screen with difficulty options and daily challenge entry point",
      placeholder: "Sudoku — home screen",
      caption: "The home screen leads with the daily challenge and four difficulty modes. The daily challenge badge shows streak status — the main reason to return tomorrow.",
      variant: "mobile",
    },
    {
      src: "/images/sudoku/screen-2.png",
      alt: "Active game board with selected cell, notes, and mistake counter",
      placeholder: "Sudoku — active game",
      caption: "The game board tracks the active session: mistake count (max 3), elapsed time, undo availability, and the current note mode state. Number entry uses a persistent pad below the board — no keyboard animation, no layout shift.",
      variant: "mobile",
    },
    {
      src: "/images/sudoku/screen-3.png",
      alt: "Statistics screen with per-difficulty breakdown and streak history",
      placeholder: "Sudoku — statistics",
      caption: "The Statistics screen shows games started vs. won, no-mistake win counts, best completion times per difficulty, and both current and longest streaks. The per-difficulty breakdown lets players see where they're improving.",
      variant: "mobile",
    },
    {
      src: "/images/sudoku/screen-4.png",
      alt: "Achievements screen with locked and unlocked milestones",
      placeholder: "Sudoku — achievements",
      caption: "Eight achievements, each tied to a specific skill or habit milestone. Locked achievements show the requirement; unlocked ones show the completion date. The list is short enough to feel attainable, specific enough to feel earned.",
      variant: "mobile",
    },
  ],
  ai: {
    stages: [
      {
        tool: "Claude Code",
        did: "scaffolded the backtracking puzzle generator and solver, the Compose screen architecture, and the DataStore persistence layer for game state and statistics",
      },
      {
        tool: "Me",
        did: "designed the difficulty calibration, retention system (daily challenge, achievement milestones, streak logic), three-mistake limit, and undo stack architecture — and validated uniqueness correctness by hand",
      },
    ],
    owned: "The retention model is entirely mine. Which signals make a puzzle game worth returning to, how achievements should be structured to reward skill rather than time, and how difficulty calibration should feel across four levels — those decisions required product judgment, not code generation.",
  },
  lessons: [
    "Constraint is a design tool. A one-week scope forces you to ship rather than plan. The result is a tighter, more deliberate product than most apps that had months of runway — because every feature had to justify its presence against a hard deadline.",
    "Puzzle uniqueness is non-trivial. The naive approach of 'remove N cells' produces boards with multiple solutions. Implementing the uniqueness check — running a full solve pass before presenting any puzzle and backtracking when multiple solutions exist — was the hardest algorithmic part of a supposedly simple project.",
    "The retention system is the real product. A Sudoku grid is a commodity — it's the framework around it that determines whether the app gets opened again tomorrow. Daily challenges, streaks, and achievement milestones are not decoration; they're the reason the user relationship extends past the first session.",
    "Three-mistake limit changes the game feel entirely. Playtesting without it produced a different kind of engagement — more exploratory, less committed. The limit reframes every cell entry as a decision rather than an experiment, which is what makes the harder difficulty levels feel hard rather than just slow.",
  ],
  order: 1,
};

export default sudoku;
