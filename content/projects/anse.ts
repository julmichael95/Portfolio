import type { Project } from "./_types";

const anse: Project = {
  slug: "anse",
  name: "Anse",
  tier: "featured",
  status: "MVP",
  categories: ["B2B SaaS", "AI"],
  oneLiner: "AI customer success that flags churn before it happens.",
  hook: "By the time a customer churns, they've already decided. Anse surfaces the signal weeks earlier — when there's still time to act.",
  timeframe: "2025 · 4 weeks",
  role: "Solo — product, design, build",
  stack: ["Next.js 16", "Supabase", "Claude", "TypeScript", "Tailwind CSS v4"],
  link: { label: "Request access", href: "#" },

  hero: {
    src: "/images/anse/hero.png",
    alt: "Anse customer success dashboard showing prioritised account risk list",
    placeholder: "Anse — account risk overview",
  },

  problem: [
    "Most B2B SaaS companies manage churn reactively. A customer goes quiet, usage drops, the renewal conversation gets awkward — and by then, the decision has already been made. Customer success teams are left doing damage control instead of proactive relationship management. They're not failing for lack of effort; they're failing because they don't have a reliable signal until it's too late.",
    "The tooling exists to fix this — Gainsight, Totango, ChurnZero — but it's priced and built for large CS organisations. Implementation takes months. Licensing runs tens of thousands annually. For early-stage and mid-market SaaS teams, the choice is enterprise software they can't afford or spreadsheets and gut feel. The gap between 'we should be proactive about retention' and 'we have a system that actually helps us be proactive' is where most companies operate.",
    "The specific failure mode Anse is designed to address: by the time a CSM checks in, the account health summary in their head is already two weeks out of date. The signals were there — in the product data, in the support queue, in the last three email threads — but no one was reading them systematically.",
  ],
  solution: {
    body: [
      "Anse is a lightweight AI customer success tool designed for SaaS companies that can't justify an enterprise CS platform. It ingests product usage data and produces a risk score per account alongside a plain-English explanation of what's driving it — written for someone who has twenty accounts to manage and four minutes before their next call.",
      "The signal layer reads four dimensions: login frequency and trend, feature adoption depth (which core features has the account actually used in the last 30 days), support ticket volume and recency, and time since last meaningful interaction. Claude analyses the combined pattern for each account and generates a natural-language health summary, plus a risk tier — Low, Medium, At Risk, or Critical.",
      "The output is a prioritised list of accounts that need attention today, ordered by risk tier and urgency. A CSM opening Anse sees who to call first and why — not a dashboard full of numbers that requires its own interpretation. The account detail view shows the full health summary, the signals driving it, and a suggested action (re-engagement email, product walkthrough, QBR request, escalation).",
    ],
    decisions: [
      "AI-generated summaries over manual scoring rubrics. The value isn't the risk number — it's the sentence that explains why an account is at risk, which a CS rep can act on immediately without digging through product analytics. A score tells you something is wrong; a sentence tells you what to do about it.",
      "Standalone product over CRM plugin. Integrating natively into Salesforce or HubSpot adds months of implementation complexity and a dependency on the customer's CRM setup. An independent tool that pulls data via API is faster to deploy, easier to validate, and keeps the scope honest at the MVP stage.",
      "Prioritised list over comprehensive dashboard. CS teams are time-constrained. A dashboard that shows everything is a product that shows nothing — it still requires the CSM to decide who matters. The prioritised list makes that decision for them, which is the actual job to be done.",
      "Risk tiers, not continuous scores. Showing a customer an '82/100 health score' invites questions about methodology and precision. Low/Medium/At Risk/Critical communicates actionability: you either need to act now, monitor this week, or you're fine. The tier system also degrades more gracefully as the input data improves over time.",
      "Suggested actions per account, not just risk labels. Knowing an account is At Risk doesn't help if the next step isn't clear. Each account detail includes a suggested intervention — based on which signals are most elevated — that gives a CSM a starting point even on accounts they don't know well.",
    ],
  },
  screens: [
    {
      src: "/images/anse/screen-1.png",
      alt: "Account risk list sorted by risk tier with last-activity timestamp",
      placeholder: "Anse — risk prioritisation",
      caption: "The main list shows every account sorted by risk tier, with the most urgent at the top. Each row shows the account name, tier badge, primary risk signal, and days since last meaningful interaction — enough context to prioritise without clicking through.",
      variant: "desktop",
    },
    {
      src: "/images/anse/screen-2.png",
      alt: "Account detail with AI health summary, signal breakdown, and suggested action",
      placeholder: "Anse — account detail",
      caption: "The account detail surfaces the full Claude-generated health summary, a breakdown of the four signals, and a suggested next action. The goal is for a CSM to read this in two minutes and know exactly what to do — no additional research required.",
      variant: "desktop",
    },
  ],
  ai: {
    stages: [
      {
        tool: "Gemini",
        did: "researched the CS tooling landscape, churn signal taxonomy in B2B SaaS, and buyer behaviour patterns in mid-market retention",
      },
      {
        tool: "Claude Design",
        did: "designed the dashboard information architecture, risk tier communication patterns, and the account detail layout optimised for CSM workflow",
      },
      {
        tool: "Claude Code",
        did: "built the signal ingestion pipeline, the risk-tier scoring engine, the Claude API integration for health summary generation, and the account detail views",
      },
      {
        tool: "Me",
        did: "defined the signal taxonomy, risk tier thresholds, the suggested-action logic, and what a useful health summary actually looks like — which required CS domain knowledge, not AI output",
      },
    ],
    owned: "The product model and signal logic are mine. What counts as a churn signal, how signals combine into a risk tier, and what a useful health summary looks like for a time-pressed CSM — those decisions required domain knowledge and product judgment. AI accelerated the implementation; the thinking that made the implementation worth building is mine.",
  },
  lessons: [
    "The hard part of churn prediction isn't the AI — it's the signal selection. Building a model that produces a number is fast. Building conviction about which signals are leading versus lagging indicators, and by how much, is the real work. The first version of the signal model was too focused on recency; support ticket sentiment turned out to be more predictive than raw login frequency.",
    "B2B MVP validation requires talking to CS teams before building, not after. Early interviews revealed that CSMs didn't want to understand health scores — they wanted to know who to call today and why. The prioritised list design came directly from that feedback; without it, the product would have been a dashboard that nobody opened.",
    "Plain-English AI output changes the UX entirely. Testing early prototypes with both a score-based view and a summary view was instructive: CSMs spent twice as long on the score view trying to interpret it. The summary view led to faster, more confident decisions. When the output is prose rather than numbers, the product becomes a tool for action rather than a tool for analysis.",
    "Risk tiers communicate faster than scores. Iterating the output format from a continuous score to four named tiers changed how testers described the product — from 'a health monitoring tool' to 'something that tells me what to do.' The framing shift was entirely in the output format, not the underlying model.",
  ],
  next: "Anse as an MVP proves the signal model works. The product becomes a business when data ingestion is automatic — via a lightweight SDK the customer installs, or through direct CRM integration that syncs product usage without manual exports. That integration layer is the next build phase, alongside Slack alerts when an account crosses into At Risk territory. The goal is zero-friction insertion into a CS team's existing workflow.",
  order: 3,
};

export default anse;
