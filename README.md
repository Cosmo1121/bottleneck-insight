# Scarcity Scout

**Find the bottleneck. Own the scarcity. Build the thesis.**

Scarcity Scout is a structured investment research workbench for identifying, scoring, and stress-testing scarcity-driven investment theses — the kind of asymmetric setups where supply constraints meet surging demand and the market hasn't caught up yet.

---

## Why Scarcity Scout?

Most investment tools help you screen stocks. Scarcity Scout helps you think.

Instead of starting with tickers, you start with a **structural thesis** — a bottleneck in the real world (energy permitting backlogs, semiconductor fab lead times, rare-earth processing capacity) — and work through a disciplined framework to decide whether it's investable, how to express it, and what would break the thesis.

**The core workflow:**

1. **Thesis** → Define the structural shift, the bottleneck, and why now
2. **Evidence** → Verify scarcity signals with source-backed evidence items
3. **Value Capture** → Map the value chain to find who actually captures pricing power
4. **Expression** → Build a layered portfolio from core holdings to speculative satellites
5. **Monitor** → Set up confirming and disconfirming signals to track over time

Each step is guided by a synthesis block that tells you what the data says before you dive into the detail — so you spend time thinking, not scrolling.

---

## Key Features

### AI-Assisted Analysis
One-click auto-fill generates a complete bottleneck analysis from a theme, powered by configurable AI models. After every fill, an **AI Analyst Memo** surfaces the reasoning, fragile assumptions, and potential false friends — so the AI feels accountable, not magical.

### Scarcity Heatmap
Nine-factor scoring system (scarcity severity, supply response speed, pricing power, barriers to entry, and more) with hover-over rubrics explaining exactly what a 1, 3, or 5 means for each factor. No ambiguous numbers.

### Bottleneck Map
Visual scatter plot of all your analyses on a scarcity-duration vs. market-mispricing grid. Instantly see which themes sit in the high-conviction quadrant.

### Portfolio Construction with Guardrails
A soft-gated portfolio builder that warns you if you're constructing positions before the thesis has earned it — minimum evidence thresholds, thesis breakers reviewed, confidence above baseline.

### Thesis Breakers
Structured checklist of what would kill the thesis (substitution risk, capital flood, demand decline, regulatory change) plus free-form disconfirming signals.

### Value Chain Mapper
Map entities across six layers — demand creators, bottleneck owners, infrastructure, picks & shovels, operators, and integrators — to find where value actually accrues.

### Ollama Integration
Run entirely against local open-source models via Ollama. Connection test, model picker, and configurable endpoint — no API keys required if you prefer local inference.

### YAML & Markdown Export
Full round-trip import/export for portability, version control, and team sharing.

### Chat Interface
Conversational AI assistant with full context of your analyses for ad-hoc questions, brainstorming, and deep dives.

---

## Getting Started

```sh
npm install
npm run dev
```

Create an account, pick a theme (e.g., "US nuclear power restart," "global copper smelting capacity," "GLP-1 API bottleneck"), and let the framework guide your research.

---

## Tech Stack

- **Frontend:** React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Framer Motion
- **Backend:** Supabase (Postgres, Edge Functions, Row-Level Security)
- **AI:** Configurable provider — cloud models via gateway or local Ollama
- **Auth:** Email/password with per-user data ownership

---

## Who Is This For?

- **Thematic investors** building conviction around structural supply/demand imbalances
- **Analysts** who want a repeatable framework instead of ad-hoc spreadsheets
- **Portfolio managers** stress-testing bottleneck theses before sizing positions
- **Curious generalists** who want to think about markets through a scarcity lens

---

## License

Private. All rights reserved.
