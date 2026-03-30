# Contributing to Scarcity Scout

Thanks for your interest in contributing! Scarcity Scout is an open-source investment research workbench, and we welcome contributions of all kinds — bug fixes, new features, documentation improvements, and design refinements.

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **bun**
- **Ollama** (optional, for AI features): [ollama.com/download](https://ollama.com/download)

### Setup

```sh
git clone https://github.com/your-username/scarcity-scout.git
cd scarcity-scout
npm install
npm run dev
```

To use AI features locally:

```sh
ollama pull llama3.2
OLLAMA_ORIGINS="*" ollama serve
```

### Database (Supabase)

If you need to work on database-related features, set up a [Supabase](https://supabase.com) project and run the migrations in `supabase/migrations/`. Set your environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## How to Contribute

### 1. Find or Create an Issue

- Check [existing issues](../../issues) before starting work
- For new features, open an issue first to discuss the approach
- Small fixes (typos, styling tweaks) can go straight to a PR

### 2. Branch & Develop

```sh
git checkout -b feat/your-feature-name
```

Follow these conventions:
- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation changes
- `refactor/` — code improvements without behavior change

### 3. Code Standards

- **TypeScript** — no `any` unless absolutely necessary; prefer proper types
- **Tailwind CSS** — use semantic design tokens from `index.css` and `tailwind.config.ts`; don't hardcode colors
- **Components** — keep them small and focused; one file per component
- **Naming** — descriptive, no abbreviations (`BottleneckAnalysis` not `BnAnalysis`)

### 4. Test Your Changes

```sh
npm run build    # Ensure it compiles cleanly
npm run test     # Run existing tests
```

Manually verify in the browser that your changes work as expected.

### 5. Submit a Pull Request

- Write a clear title and description
- Reference the related issue (e.g., "Closes #42")
- Include screenshots for UI changes
- Keep PRs focused — one feature or fix per PR

---

## Project Structure

```
src/
├── components/          # React components (workspaces, panels, UI)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, prompts, export logic
├── pages/               # Route-level pages
├── types/               # TypeScript type definitions
├── integrations/        # Supabase client (auto-generated, do not edit)
└── index.css            # Design tokens and global styles

supabase/
├── functions/           # Edge functions (autofill, chat, API)
└── migrations/          # Database migrations
```

### Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useAISettings.ts` | AI provider configuration (Ollama, OpenAI, Anthropic) |
| `src/hooks/useAnalyses.ts` | CRUD operations for bottleneck analyses |
| `src/hooks/useAutofillAnalysis.ts` | AI auto-fill logic |
| `src/lib/prompts.ts` | System prompts shared across AI features |
| `src/types/analysis.ts` | Core `BottleneckAnalysis` type definition |

---

## Design Guidelines

Scarcity Scout has a deliberate dark, data-dense aesthetic inspired by Bloomberg terminals and intelligence dashboards. When contributing UI changes:

- Use the existing design tokens (`--primary`, `--accent`, `--muted`, etc.)
- Maintain the monospace + display font pairing
- Prefer information density over whitespace
- Use `framer-motion` for animations — subtle and purposeful
- Follow the `panel` / `panel-header` pattern for new workspace sections

---

## Adding a New AI Provider

The app supports pluggable AI providers. To add one:

1. Add the provider option to `AISettings` in `src/hooks/useAISettings.ts`
2. Add the provider UI to `src/components/SettingsWorkspace.tsx`
3. Handle the provider in `src/hooks/useAutofillAnalysis.ts` (client-side for local providers) or the edge functions (for cloud providers that need server-side key handling)
4. Update `src/components/ChatPanel.tsx` with the streaming logic for the new provider

---

## Reporting Bugs

When filing a bug report, include:

- Steps to reproduce
- Expected vs. actual behavior
- Browser and OS
- Console errors (if any)
- Which AI provider you're using (Ollama model, OpenAI, Anthropic)

---

## Code of Conduct

Be respectful, constructive, and collaborative. We're all here to build something useful.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
