import type { Project } from "./_types";

const chess: Project = {
  slug: "chess",
  name: "CheckmateFlow",
  tier: "experiment",
  status: "Shipped",
  categories: ["Mobile"],
  oneLiner: "A native Android chess app built around a custom FIDE-complete rules engine.",
  hook: "Chess is a fully solved domain — which makes it an ideal target for practising execution quality. The goal wasn't to invent; it was to implement correctly.",
  timeframe: "2025 · 2 weeks",
  role: "Solo",
  stack: ["Kotlin", "Jetpack Compose", "Android", "Kotlinx Serialization", "DataStore"],

  hero: {
    src: "/images/chess/hero.png",
    alt: "CheckmateFlow Android app — game board with move highlights and notation row",
    placeholder: "CheckmateFlow — game in progress",
  },

  problem: [
    "Most Android chess apps sit at two extremes: barebones educational tools with clunky UI, or feature-heavy platforms cluttered with puzzles, ELO tracking, and social layers nobody asked for. The goal here was the middle ground — a complete, correct, well-executed chess experience with nothing extraneous. The interesting constraint is that 'complete' in chess means implementing the full FIDE ruleset correctly, including all draw conditions. That's harder than it sounds.",
  ],
  solution: {
    body: [
      "CheckmateFlow is a native Android chess app built with Jetpack Compose around a custom domain-layer rules engine. The engine represents the full game as a @Serializable data class — ChessGame — which holds the board state, active colour, castling rights, en passant eligibility, a half-move clock for the 50-move rule, a full-move counter, and a position history for threefold repetition detection.",
      "Legal move generation is per-square via getLegalMoves(Square), with getAllLegalMoves() used for game status resolution. Every move produces a new immutable ChessGame rather than mutating state — move application returns a copy with the delta applied. Move flags (CASTLE_KINGSIDE, CASTLE_QUEENSIDE, EN_PASSANT, PAWN_DOUBLE_PUSH) are encoded on each move so the application layer knows exactly what kind of update to render.",
      "The engine resolves six terminal game states: CHECKMATE, STALEMATE, DRAW_INSUFFICIENT_MATERIAL, DRAW_THREEFOLD_REPETITION, DRAW_FIFTY_MOVE_RULE, and ONGOING. Castling rights are tracked independently for all four possibilities (white kingside/queenside, black kingside/queenside) in a CastlingRights data class, updated on every king or rook move and invalidated correctly on capture. Threefold repetition is detected by hashing the board position and checking frequency against a positionHistory map seeded at game start. The 50-move draw triggers when the halfMoveClock reaches 100 (counting half-moves).",
      "The ViewModel layer exposes undoLastMove() — which pops the move history and restores the previous ChessGame snapshot — and a scrollable move-history chip row showing algebraic notation for the full game. Two board themes (Modern and Wood) and coordinate label visibility are user-configurable via DataStore, with play-as-colour selection allowing either side.",
    ],
    decisions: [
      "Custom rules engine over a library. The learning was in implementing move validation, pin detection, check evasion, and all five draw conditions correctly — offloading that to a library would have missed the point of the project. The engine is also the part that needed to be correct before anything else mattered.",
      "Immutable ChessGame data class. Every move returns a new instance rather than mutating state. This eliminates shared-state bugs across the ViewModel/UI boundary, makes undo trivially correct (just pop the history stack), and keeps Compose recomposition predictable — the renderer sees a new object and redraws only what changed.",
      "Kotlinx Serialization on the domain model. Making ChessGame @Serializable from the start meant game-state persistence to DataStore required no mapping layer. The same data class the engine operates on is what gets saved — no translation step, no desync risk.",
      "halfMoveClock tracking for the 50-move rule, not a move counter. The FIDE 50-move rule counts half-moves (plies) since the last pawn move or capture, not full moves. Tracking this on the game state directly — and incrementing/resetting on every move application — meant the draw detection required no separate bookkeeping.",
      "positionHistory pre-seeded with the opening position. ChessGame.newGame() inserts the starting position into positionHistory at construction, so the threefold repetition check works correctly if the board returns to the initial state. A detail that's easy to miss and breaks repetition detection in specific endgame compositions.",
      "Two-week scope with local two-player only. Chess is infinitely extensible — puzzles, analysis, online play, ELO. Choosing to stop at a polished local two-player game with a correct ruleset was the most important decision. A correct, complete local game is more valuable than an incomplete networked one.",
    ],
  },
  screens: [
    {
      src: "/images/chess/screen-1.png",
      alt: "Game board with selected piece, legal move dots, and last-move highlight",
      placeholder: "CheckmateFlow — game board",
      caption: "Tapping a piece highlights legal destinations with animated dots. The last move is highlighted on both origin and destination squares. The visual hierarchy is deliberate: possible moves are subtle, the last move is clear, and the selected piece is prominent.",
      variant: "mobile",
    },
    {
      src: "/images/chess/screen-2.png",
      alt: "Move history chip row with scrollable algebraic notation",
      placeholder: "CheckmateFlow — move notation",
      caption: "The move history row shows scrollable algebraic notation for the full game. Tapping the undo control reverts the last half-move and removes the most recent notation chip — the history and board state always stay in sync.",
      variant: "mobile",
    },
    {
      src: "/images/chess/screen-3.png",
      alt: "Game over dialog showing checkmate result and restart option",
      placeholder: "CheckmateFlow — game over",
      caption: "The game-over state surfaces the specific terminal condition — checkmate, stalemate, or draw type — rather than a generic 'Game Over.' Players see exactly how the game ended, which matters for learning.",
      variant: "mobile",
    },
    {
      src: "/images/chess/screen-4.png",
      alt: "Settings screen with board theme, coordinate toggle, and play-as-colour selection",
      placeholder: "CheckmateFlow — settings",
      caption: "Settings are minimal and functional: board theme (Modern or Wood), coordinate label visibility, and which colour the local player controls. All settings persist across sessions via DataStore.",
      variant: "mobile",
    },
  ],
  ai: {
    stages: [
      {
        tool: "Claude Code",
        did: "built the board rendering layer, the ViewModel architecture, the move-history chip row, the pawn promotion picker dialog, and the DataStore settings persistence",
      },
      {
        tool: "Me",
        did: "designed the rules engine architecture, implemented all move validation and draw condition logic, chose the immutable data model, and validated correctness across pin detection, castling edge cases, en passant, and all five terminal states",
      },
    ],
    owned: "The rules engine and game-state architecture were designed and validated by me. Correctness in chess is non-negotiable — every edge case (discovered check, castling through check, en passant pin interactions, threefold repetition with transpositions) required manual reasoning and test coverage. Code generation accelerated the UI layer; the engine is mine.",
  },
  lessons: [
    "Known domains demand execution quality, not product invention. There's no ambiguity about what chess is supposed to do — which makes every rough edge immediately visible to anyone who plays. That pressure produced a more carefully built product than most novel domains would have, because there was nowhere to hide.",
    "Immutable state pays off immediately and keeps paying. Replacing rather than mutating ChessGame felt like overhead in the first day. It eliminated a class of state bugs in the first week, made undo straightforward to implement, and meant the Compose renderer never had to guess whether something changed. The upfront discipline reduced total debugging time.",
    "FIDE draw conditions are deceptively intricate. Checkmate and stalemate are well-understood. The 50-move rule, threefold repetition, and insufficient material detection each have subtle cases — the 50-move clock resets on captures but not all pawn moves, position repetition ignores castling rights in some interpretations, insufficient material has specific piece-combination rules. Getting these right required reading the actual FIDE handbook, not just chess tutorials.",
    "The undo stack is a product decision, not just a feature. Allowing undo in a two-player local game reframes the product: it becomes a learning tool and an analysis surface, not just a game. The decision to include it (and to implement it correctly against an immutable history stack) shaped what kind of product CheckmateFlow is.",
  ],
  order: 2,

  workCard: {
    category: "Mobile App / Strategy Learning",
    description:
      "A chess-focused product built around structured practice, decision-making, and repeatable improvement. It reflects my interest in products that turn skill development into a more engaging and systematic experience.",
  },
};

export default chess;
