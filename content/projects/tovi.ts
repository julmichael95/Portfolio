import type { Project } from "./_types";

const tovi: Project = {
  slug: "tovi",
  name: "Tovi",
  tier: "featured",
  status: "Shipped",
  categories: ["Fintech", "Mobile"],
  oneLiner: "Send money to friends in two taps. No friction.",
  hook: "Most P2P payment apps make you log in, verify, wait, and then pay. Tovi collapses that into a handle and a number.",
  timeframe: "2025 · 8 weeks",
  role: "Solo — product, design, build",
  stack: ["React", "Vite", "TypeScript", "Fastify", "PostgreSQL", "Prisma", "Celo"],
  link: { label: "View app", href: "#" },

  hero: {
    src: "",            // Add: /images/tovi/hero.png  (home screen, ~1600×1000 or mobile crop)
    alt: "Tovi home screen showing cUSD balance and send/receive actions",
    placeholder: "Tovi — home and balance",
  },

  problem: [
    "Sending money between friends is a solved problem — if you're all in the same country with the same bank system. The moment you cross a border, or try to split a bill across five people using four different apps, it breaks down. Traditional bank transfers are slow and expensive. Venmo and Cash App are US-only. Most crypto wallets require the recipient to already understand private keys and gas fees.",
    "The underlying gap: there's no lightweight, globally-accessible way to send a small amount of money to someone using just their phone number — without requiring a bank account, a specific nationality, or crypto fluency on both sides. That's the problem Tovi is built for.",
    "The specific moment that motivated it: trying to split a dinner bill across five people in three different countries, at the table, in real time. No single app worked for everyone present.",
  ],
  solution: {
    body: [
      "Tovi is a progressive web app for sending and receiving cUSD — a US dollar stablecoin on the Celo network — using a phone number and a short handle. No bank account required. Transfers are settled on-chain in seconds rather than business days, with no per-transaction fee meaningful enough to matter for small amounts.",
      "Onboarding takes about two minutes: enter a phone number, verify with OTP, choose a display name and handle, set an optional passcode, and the app provisions a Celo wallet in the background. The provisioning screen — 'Creating your wallet… Securing your keys… Setting up your profile…' — makes the on-chain step feel like a normal product setup flow, not a crypto operation.",
      "The core send flow is three screens: pick a contact or enter a handle, enter an amount with an optional note, review and confirm. A passcode challenge sits between the review and the actual submission — it's the security layer that replaces the confirmation friction that normal payment apps build into their UX. The request flow is symmetrical: set an amount, generate a QR code or shareable pay link, and the sender arrives at a pre-filled send screen.",
      "Tovi is currently live on Celo Sepolia testnet, using test cUSD from the Celo faucet. The product logic, flows, and architecture are complete — the mainnet transition requires adding an on-ramp (converting real currency to cUSD) and passing the required compliance review for real-money transfers.",
    ],
    decisions: [
      "Phone-number auth via OTP, not email/password. Phone numbers are universal and already used as identity in every market this product targets. OTP removes the password reset surface, and the handle system (@name) gives users a friendly identifier that doesn't expose their number.",
      "cUSD on Celo rather than other chains or stablecoins. Celo's transaction fees are low enough — fractions of a cent — that small payments remain practical. USDC on Ethereum would cost more in gas than the payment itself. The Celo ecosystem also has existing infrastructure for mobile-first use cases, which aligned with the product direction.",
      "PWA over a native app. Pay links — a URL you can share in a message, email, or tweet that pre-fills the send flow for the recipient — only make sense as a web-native pattern. A native app would require the recipient to install it before they can receive money. The web app removes that installation gate.",
      "Passcode as a security layer, not a full auth system. Rather than building a second authentication layer, the passcode is a send-time friction gate — it confirms intentionality before broadcasting a transaction. It's optional, but strongly suggested during onboarding. This keeps the UX light while giving users meaningful protection against accidental or unauthorised sends.",
      "Testnet first, mainnet when ready. Shipping on testnet meant the full product — including real wallet provisioning, on-chain transfers, and balance queries against a live RPC — could be built and validated without compliance obligations. The mainnet transition is a separate phase, not a feature.",
    ],
  },
  screens: [
    {
      src: "",            // Add: /images/tovi/screen-1.png  (home screen, ~390×844 mobile)
      alt: "Home screen with cUSD balance, send/receive actions, and recent transactions",
      placeholder: "Tovi — home screen",
      caption: "The home screen shows balance front and centre, with Send and Receive as the two primary actions. Everything else — activity, settings — is secondary. The hierarchy is deliberate: this is a payments tool, not a social app.",
      variant: "desktop",   // PWA — desktop viewport; switch to "mobile" if using phone screenshots
    },
    {
      src: "",            // Add: /images/tovi/screen-2.png  (send picker, ~1600×1000)
      alt: "Send flow — contact picker with search and handle entry",
      placeholder: "Tovi — send picker",
      caption: "The recipient picker searches contacts and registered handles simultaneously. Entering a phone number directly is also supported — it falls back gracefully if the recipient isn't on Tovi yet, with a 'Invite to receive' option.",
      variant: "desktop",
    },
    {
      src: "",            // Add: /images/tovi/screen-3.png  (amount entry, ~1600×1000)
      alt: "Send flow — amount entry with keypad and optional note",
      placeholder: "Tovi — amount entry",
      caption: "Amount entry uses a custom keypad rather than the native keyboard — it's faster, avoids the keyboard animation jank, and keeps the layout stable. The note field is optional but surfaces the last three notes used, reducing friction for recurring payments.",
      variant: "desktop",
    },
    {
      src: "",            // Add: /images/tovi/screen-4.png  (activity feed, ~1600×1000)
      alt: "Activity feed showing completed and pending transactions",
      placeholder: "Tovi — activity feed",
      caption: "The activity feed shows both sent and received transactions with their on-chain status. The 'View on explorer' deep-link to Celoscan is available on completed transactions — important for trust, even if most users never tap it.",
      variant: "desktop",
    },
  ],
  ai: {
    stages: [
      {
        tool: "Gemini",
        did: "researched the Celo ecosystem, stablecoin UX patterns across fintech apps, and the compliance landscape for testnet vs mainnet money movement",
      },
      {
        tool: "Claude Design",
        did: "designed the send, request, and onboarding flows; defined the component hierarchy and the mobile-first visual system including the custom keypad and transaction card patterns",
      },
      {
        tool: "Claude Code",
        did: "built the Fastify API with Prisma and PostgreSQL, the Celo wallet integration and RPC layer, the OTP auth flow, the PWA shell, and the send/request state machines",
      },
      {
        tool: "Me",
        did: "defined the product model, security architecture (passcode gate, OTP flow), made every technology selection, and handled all edge cases in the payment flow including partial failures and double-submit prevention",
      },
    ],
    owned: "The product model, security architecture, and payment flow logic are entirely mine. Every trust and safety decision — what happens when a transaction fails mid-flight, how to prevent double-submits, when to show a passcode — was reasoned through by hand. AI accelerated the implementation of decisions I had already made.",
  },
  lessons: [
    "Fintech edge cases are where products live or die. The happy path — enter amount, confirm, done — takes an afternoon to build. The other 30% of the time is spent on what happens when the RPC is slow, when the user taps confirm twice, when the transaction times out but wasn't rejected, or when the balance query returns stale data. Those edge cases require explicit decisions, not just error handlers.",
    "Stablecoin UX needs to hide the blockchain entirely. In early testing, any mention of gas, wallets, confirmations, or chain IDs caused confusion — even with technically-literate users. The product has to feel like sending a message. The on-chain mechanics are an implementation detail, not a feature.",
    "The passcode is the right abstraction for send-time security. Full biometric auth would have required native APIs and killed the PWA approach. A simple passcode challenge before each send is fast to implement, easy to understand, and provides meaningful protection. Perfect security is the enemy of shipped product.",
    "Testnet discipline. Building on testnet first was the right call — it meant the entire stack, including real wallet provisioning and on-chain transfers against a live RPC, was validated before any compliance work began. The delta between testnet and mainnet is well-defined: on-ramp integration and the compliance review. Nothing about the product architecture needs to change.",
  ],
  next: "Tovi on mainnet needs two things: an on-ramp (a way to convert real currency into cUSD via bank card or transfer) and group payment splitting, which is the original use case that motivated the product. Both are defined — the on-ramp requires working with a Celo ecosystem partner and passing the relevant compliance review; group splitting is a product and data model extension on top of the existing payment rails. The core infrastructure is already in place.",
  order: 2,
};

export default tovi;
