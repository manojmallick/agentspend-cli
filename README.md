# agentspend

**Track and cap AI agent API spend, and sync agent config/state across environments.**

[![npm version](https://img.shields.io/npm/v/agentspend-cli?color=7c6af7&label=latest&logo=npm)](https://www.npmjs.com/package/agentspend-cli)
[![build](https://github.com/manojmallick/agentspend-cli/actions/workflows/build.yml/badge.svg)](https://github.com/manojmallick/agentspend-cli/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-7c6af7.svg)](LICENSE)

Local-first, free CLI. No server, no account — everything lives in `~/.agentspend`
(or `$AGENTSPEND_HOME` if set).

![agentspend stats](docs/stats-banner.svg)

Real numbers, not a benchmark — agentspend doesn't have a retrieval/accuracy metric
to report, so this is test count, package size, and dependency count, regenerated
from an actual build/test run by `scripts/refresh-stats.mjs`. See
[docs-vp/guide/stats.md](docs-vp/guide/stats.md) for details.

## Try it now

```bash
npx agentspend-cli spend track --provider openai --cost 0.42
npx agentspend-cli spend report
```

## Install

```bash
npm install -g agentspend-cli
```

The package on npm is `agentspend-cli`; the command it installs is `agentspend`.

## What agentspend solves

- **No visibility into agent API cost** — `spend track` records each call's cost by provider and project; `spend report` totals it.
- **Budgets get blown silently** — `spend budget <amount>` sets a cap; `spend budget` (no argument) checks status and exits non-zero when over, so it can gate a CI job.
- **Agent config/memory drifts across machines** — `sync save`/`sync load` snapshots a config or state file under a named profile you can restore anywhere.

## Usage

### spend

```bash
agentspend spend track --provider openai --model gpt-4o --cost 0.42 --project myagent
agentspend spend track --provider anthropic --cost 0.10 --project myagent

agentspend spend report                    # totals across all entries
agentspend spend report --project myagent  # scoped to one project
agentspend spend report --json             # machine-readable output

agentspend spend budget 10.00              # set a $10 budget
agentspend spend budget                    # check status; exits 1 if over budget
```

### sync

```bash
agentspend sync save myagent ./agent-config.json    # snapshot a file as "myagent"
agentspend sync load myagent ./restored-config.json # restore it elsewhere
agentspend sync list                                # list saved profiles
```

## Develop

```bash
pnpm install
pnpm dev -- spend track --provider openai --cost 0.42
pnpm typecheck
pnpm test
```

App code lives in `src/logic/`; the CLI wiring is in `src/cli.ts`.

## Release

```bash
pnpm changeset        # describe your change
git commit -am "..."  # commit the changeset file
```

Merging to `main` triggers the `deploy-npm-publish` GitHub Actions workflow (Changesets
opens a "Version Packages" PR; merging that publishes). Requires an `NPM_TOKEN` secret.

## Docs

- [Full CLI reference](docs-vp/guide/cli.md)
- [Roadmap](docs-vp/guide/roadmap.md)
- [Project stats](docs-vp/guide/stats.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please also review our [Code of Conduct](CODE_OF_CONDUCT.md)
and [Security Policy](SECURITY.md).

## License

[MIT](LICENSE) © Manoj Mallick
