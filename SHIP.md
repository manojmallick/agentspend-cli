# agentspend-cli — ship & npm release guide

## Pitch

**Local-first CLI for AI agent developers & teams** to track API spend by provider/model/project, enforce budget caps with CI gates, and snapshot agent configs across machines with zero servers, accounts, or telemetry.

Thesis: **Free open-source CLI** (`npm install -g agentspend-cli`) with optional team cloud sync SKU later.

## 10-minute demo

```bash
cd agentspend-cli
pnpm install
pnpm build
```

1. Track API spend across providers:
   ```bash
   npx agentspend-cli spend track --provider openai --model gpt-4o --cost 0.42 --project agent-alpha
   npx agentspend-cli spend track --provider anthropic --model claude-3-5-sonnet --cost 0.18 --project agent-alpha
   ```

2. Generate spend reports:
   ```bash
   npx agentspend-cli spend report
   npx agentspend-cli spend report --project agent-alpha
   npx agentspend-cli spend report --json
   ```

3. Set budget cap & check CI status:
   ```bash
   npx agentspend-cli spend budget 5.00
   npx agentspend-cli spend budget   # Exits 0 if under budget, 1 if over budget (ideal for CI)
   ```

4. Snapshot & restore agent configuration profile:
   ```bash
   npx agentspend-cli sync save myprofile ./wrapper.config.ts
   npx agentspend-cli sync list
   npx agentspend-cli sync load myprofile ./restored.config.ts
   ```

## npm Publishing & Release Pipeline

The package is configured for automated npm release via **Changesets**:

```bash
# Add a changeset describing the update
pnpm changeset

# Commit the changeset file
git commit -am "docs: add release changeset"
```

Merging to `main` triggers `.github/workflows/deploy-npm-publish.yml` which opens a "Version Packages" PR or publishes directly to npm when `NPM_TOKEN` is present.

## Verification

```bash
pnpm typecheck
pnpm test
```

## Pitch one-liner

"Don't get surprised by a $500 LLM API bill — agentspend tracks your local agent spend and caps your CI pipeline in seconds."
