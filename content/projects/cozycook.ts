import type { Project } from "./_types";

const cozycook: Project = {
  slug: "cozycook",
  name: "CozyCook",
  tier: "featured",
  status: "Shipped",
  categories: ["Consumer", "AI"],
  oneLiner: "Turn what's already in your kitchen into tonight's dinner.",
  hook: "Most people don't skip cooking because they can't cook — they skip it because deciding what to make is the hardest part. CozyCook removes that decision entirely.",
  timeframe: "2025 · 5 weeks",
  role: "Solo — product, design, build",
  stack: ["Next.js 16", "Supabase", "Tailwind CSS v4", "Claude", "Zod"],
  link: undefined,

  hero: {
    src: "",
    alt: "CozyCook — recipe suggestions based on your current pantry and fridge",
    placeholder: "CozyCook — pantry to plate",
    objectPosition: "top",
  },

  problem: [
    "Cooking at home is supposed to save money and feel good. In practice it doesn't — because the real obstacle isn't skill, it's the planning overhead that happens before anything goes on the stove. What do I have? What can I make with it? What do I still need to buy? Those three questions, every evening, are why people open Uber Eats instead.",
    "Recipe apps make this worse, not better. They show you aspirational food that requires a full grocery run to make. Search results are filtered by cuisine and dietary preference but never by what's actually in your kitchen. The ingredient list is always a problem to solve, not a starting point.",
    "CozyCook inverts the model: your pantry is the input, not the obstacle. You start with what you have. The app figures out what's cookable.",
  ],
  solution: {
    body: [
      "CozyCook is a web app that generates personalised recipe suggestions based on a user's current pantry and fridge contents. Onboarding is fast: scan a receipt, type in items freeform, or pick from a common-staples list. The app maintains a live ingredient inventory — quantities, expiry estimates, and a freshness signal that surfaces things that need to be used soon.",
      "Recipe generation runs through Claude, which reasons across the inventory to produce recipes that use as many on-hand ingredients as possible. Each suggestion comes with an ingredient match score, a list of items already stocked, and a short list of optional additions that would improve the dish but aren't required. The output feels like advice from someone who's already looked in your fridge — not a search result.",
      "The weekly meal planner lets users lock in recipes for the week and generates a shopping list for the delta: only the items not already stocked. Shopping lists group by store section and exclude anything with sufficient quantity already in the pantry. Meals that get cooked decrement the inventory automatically.",
    ],
    decisions: [
      "Pantry-first, not recipe-first. Every other cooking app shows you recipes first and makes inventory a filter. CozyCook flips this: you log what you have, and everything downstream — suggestions, planning, shopping — flows from that. It's a structurally different product, not a feature addition to an existing pattern.",
      "Claude for recipe reasoning, not a recipe database. A recipe database has fixed entries and rigid filtering. Claude can reason about specific combinations — three chicken thighs, half a can of coconut milk, some wilting spinach — and produce something that actually fits. The output is contextual and variable in a way no curated database could match.",
      "Ingredient match score over a binary 'you can make this / you can't.' Cooking is rarely all-or-nothing. Showing users an 85% match with two optional missing ingredients is more useful than hiding the recipe entirely. It also teaches users which pantry staples are worth keeping stocked — the items that unlock the most recipes.",
      "Expiry surfacing as a push mechanism. The freshness signal — a subtle indicator on items approaching expiry — turns the pantry from a static list into something that generates suggestions proactively. 'Use your spinach tonight' is a more useful nudge than a generic daily meal prompt.",
    ],
  },
  screens: [
    {
      src: "",
      alt: "Pantry view showing current ingredients grouped by category with freshness indicators",
      placeholder: "CozyCook — pantry view",
      caption: "The pantry view groups ingredients by category with a freshness signal on items nearing expiry. Adding items is freeform — type, scan a receipt, or pick from a staples list. The inventory stays lightweight to maintain.",
      variant: "mobile",
      objectPosition: "top",
    },
    {
      src: "",
      alt: "Recipe suggestions screen showing match score and available vs. missing ingredients",
      placeholder: "CozyCook — recipe suggestions",
      caption: "Recipe suggestions show an ingredient match score alongside what's already stocked and what's optional. The goal is a fast yes/no decision — not a research session. High-match recipes load first.",
      variant: "mobile",
      objectPosition: "top",
    },
    {
      src: "",
      alt: "Weekly meal planner with locked-in recipes and auto-generated shopping list",
      placeholder: "CozyCook — meal planner",
      caption: "The weekly planner locks in recipes for each day and generates a shopping list for only the missing ingredients, grouped by store section. Meals marked as cooked decrement the pantry automatically.",
      variant: "mobile",
      objectPosition: "top",
    },
  ],
  ai: {
    stages: [
      {
        tool: "Perplexity",
        did: "researched the recipe app landscape, identified the pantry-first gap in existing products, and stress-tested the core positioning against competing approaches",
      },
      {
        tool: "Claude",
        did: "powers the recipe generation engine at runtime — reasoning across the user's actual inventory to produce contextual, match-scored suggestions rather than pulling from a static database",
      },
      {
        tool: "Claude Code",
        did: "built the pantry inventory system, the meal planner, and the shopping list delta logic",
      },
    ],
    owned: "The product model — pantry-first rather than recipe-first — is the core design decision that makes CozyCook different from every other cooking app. The ingredient match scoring system, the expiry surfacing mechanic, and the shopping list delta logic were all designed and implemented by me. Claude handles recipe reasoning at runtime; the system that feeds it context and interprets the output is mine.",
  },
  lessons: [
    "Inverting a familiar model is a stronger product position than adding features to it. Every recipe app starts from recipes. Starting from the pantry isn't an incremental improvement — it's a different product for a different moment. That structural difference is harder to copy than any individual feature.",
    "AI-generated content works best when the context it receives is precise. Early recipe suggestions were too generic because the prompt wasn't specific enough about quantities, freshness, and cooking time constraints. Tightening the context — passing exact quantities and flagging expiry items — made the output substantially more useful without changing the model.",
    "The shopping list is where the value compounds. The pantry and recipe features feel useful individually, but the shopping list — which knows what you have, what you've planned, and what the delta is — is where the product earns repeat use. Planning friction is downstream of shopping friction; reducing the shopping step reduces the whole loop.",
  ],

  order: 4,

  workCard: {
    category: "Consumer App / Cooking",
    description:
      "A recipe app built around what's already in your kitchen. Enter your pantry, get AI-generated meal suggestions matched to what you actually have, plan the week, and generate a shopping list for only the gaps.",
    cta: "View case study",
  },
};

export default cozycook;
