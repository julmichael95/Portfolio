import type { Project } from "./_types";

const alune: Project = {
  slug: "alune",
  name: "Alune",
  tier: "featured",
  status: "Shipped",
  categories: ["Consumer", "AI", "Mobile"],
  oneLiner: "AI wardrobe that styles you from clothes you already own.",
  hook: "Most people own enough clothes — they just can't see the combinations. Alune solves the visibility problem.",
  timeframe: "2025 · 6 weeks",
  role: "Solo — product, design, build",
  stack: ["Next.js 16", "Supabase", "Tailwind CSS v4", "Gemini 2.5 Flash", "Claude", "Zod"],
  link: { label: "View app", href: "#" },

  hero: {
    src: "/images/alune/hero.png",
    alt: "Alune — daily style dashboard showing today's outfit and weather context",
    placeholder: "Alune — daily style dashboard",
  },

  problem: [
    "Most people don't have a clothes problem — they have a visibility problem. They own enough to dress well but face the same mental blank every morning: staring at a full closet and feeling like they have nothing to wear. The problem isn't scarcity. It's that the combinations are invisible.",
    "Existing wardrobe apps solve the wrong thing. Manual cataloguing tools require tedious data entry and get abandoned within a week. Inspiration boards are full of clothes you don't own. Style quizzes give generic advice. None of them answer the only question that actually matters when you're running late: given what I already own, what do I wear today?",
    "That gap — between a real wardrobe and a usable one — is what Alune is built to close.",
  ],
  solution: {
    body: [
      "Alune is a mobile-first web app that turns a physical wardrobe into a styled, plannable system. The onboarding is camera-first: you photograph your clothes, and Gemini 2.5 Flash classifies each item automatically, extracting category, subcategory, colour (family, tone, depth, saturation), fabric, patterns, fit, formality level, seasons, occasions, and style tags. A 30-item closet can be catalogued in under ten minutes.",
      "The outfit engine runs in two stages. First, a candidate generator applies season and occasion filters to produce a capped set of outfit combinations — typically around 150 candidates from a medium-sized closet. Second, a scoring engine ranks every candidate across six dimensions: colour harmony, silhouette balance, occasion fit, aesthetic consistency, trend relevance, and simplicity. Each dimension returns a score plus a confidence value; low-confidence dimensions contribute less weight to the final total, so the system degrades gracefully when data is sparse.",
      "A diversity pass then removes near-duplicates — outfits sharing the same top-and-bottom core pair collapse to the best-scoring variant — so the results feel varied rather than repetitive. The full product includes a Today dashboard, a 7-day Plan calendar, a Pack wizard for travel capsules, and weather-aware daily suggestions. Virtual try-on (Gemini image generation against a user photo) is gated behind a Pro tier; all core features are free.",
    ],
    decisions: [
      "Camera-first onboarding. The closet is useless unless it's populated. Every other wardrobe app fails at step one because data entry is a chore. The AI auto-classify flow removes that friction — a photo takes two seconds, and Gemini handles the rest. Users see their first outfit recommendations before they've finished adding clothes.",
      "Confidence-weighted scoring over a fixed formula. Each scoring dimension returns a confidence value alongside its score. Dimensions where the model is uncertain (due to sparse or ambiguous item data) contribute proportionally less to the final total. This means recommendations improve as the closet data improves, without requiring a model retrain.",
      "Free tier for core features, Pro for generative AI. Classification and outfit generation use Gemini for vision analysis on the free tier. Virtual try-on uses Gemini's image generation API, which carries real per-request cost — that's the natural Pro gate. Keeping the core value loop free was more important than early monetisation.",
      "Web app over native. Next.js + Supabase delivered a full auth, database, and storage layer in days. A native iOS or Android app would have doubled the build timeline for no material UX difference at this stage. The mobile-first web app is fast enough, and it deploys without an app store review cycle.",
    ],
  },
  screens: [
    {
      src: "/images/alune/screen-1.png",
      alt: "Today dashboard showing today's planned outfit with weather context",
      placeholder: "Alune — today dashboard",
      caption: "The Today screen answers the core question immediately: here's what you're wearing today, adjusted for the weather. The weather bar isn't decoration — it actively affects which items the engine weights toward.",
      variant: "mobile",
    },
    {
      src: "/images/alune/screen-2.png",
      alt: "Closet grid showing 8 AI-classified wardrobe items with category and wear count",
      placeholder: "Alune — closet grid",
      caption: "The closet view surfaces the AI-extracted metadata — colour families, occasions, seasons — so users can verify classifications and correct outliers. Accuracy here directly improves outfit quality.",
      variant: "mobile",
    },
    {
      src: "/images/alune/screen-3.png",
      alt: "Outfits tab showing saved outfit combinations with favourite and wear count tags",
      placeholder: "Alune — outfit picks",
      caption: "Outfit suggestions are ranked but the score isn't shown to the user — just the order. The explanation string (colour harmony, occasion fit) is available in the detail view for the curious.",
      variant: "mobile",
    },
    {
      src: "/images/alune/screen-4.png",
      alt: "Today view scrolled to show recent outfits — Sand on sand and Navy work set",
      placeholder: "Alune — recent outfits",
      caption: "The Plan calendar lets you assign outfits to days in advance — useful for travel, busy weeks, or anyone who thinks about clothes on Sunday rather than Monday morning.",
      variant: "mobile",
    },
  ],
  ai: {
    stages: [
      {
        tool: "Gemini",
        did: "classified garments from photos — extracting 12+ fields per item including colour family, fabric, fit, formality, seasons, and style tags using Gemini 2.5 Flash vision",
      },
      {
        tool: "Claude Design",
        did: "designed the visual system, information architecture, and mobile-first component hierarchy for the full app including closet, plan, and style flows",
      },
      {
        tool: "Claude Code",
        did: "built the two-stage outfit scoring engine, Supabase schema and RLS policies, all AI API routes, and the candidate generator with diversity logic",
      },
      {
        tool: "Me",
        did: "defined the product model, wrote and tuned all Gemini prompts, set scoring dimension weights, designed the free/Pro feature split, and validated edge cases in the recommendation engine",
      },
    ],
    owned: "The product architecture and every prompt were authored by me. The six scoring dimensions, their weights, the penalty system, and the diversity logic are product decisions — not AI output. Claude accelerated implementation; the thinking behind it is mine.",
  },
  lessons: [
    "The AI classification step needed to feel instant. If the loading state was visible for more than a second or two, the onboarding felt clunky — users would second-guess whether the upload worked. Optimising the Gemini request pipeline (batching, caching headers, streaming the classification result before the image finishes uploading) was as much a UX problem as a technical one.",
    "Outfit diversity is harder than outfit quality. The first version of the recommendation engine returned highly-scored outfits that were effectively the same look in slight variations. The diversity pass — collapsing candidates that share the same top-bottom core pair — was the single insight that made results feel like a real stylist's choices rather than a search engine's.",
    "Confidence-weighted scoring changes how you think about data quality. The original plan was to fix classification errors before worrying about the recommendation engine. The confidence system inverted that: instead of blocking on perfect data, low-confidence items simply contribute less to the ranking. The product works on a half-filled closet and improves as the user adds more.",
    "Scope the v1 ruthlessly. The try-on feature, the inspo board, and the style quiz all exist in the codebase. The product is most useful at the intersection of closet + plan + today. Every additional feature competes for the user's attention with the core loop.",
  ],
  next: "The next meaningful improvement is a feedback loop. Right now the engine recommends from a static model — it doesn't know which suggestions you accepted or which you skipped. Adding implicit signals (which outfits were saved to the plan, which were dismissed) and shifting scoring weights accordingly would transform Alune from 'AI-generated recommendations' to 'genuinely personalised styling.' That's the version worth building next.",
  order: 1,
};

export default alune;
