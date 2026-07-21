# Project stats

agentspend doesn't have a retrieval/accuracy benchmark — it's a spend tracker and
config-sync tool, not a code-retrieval system. What it does have is real, verifiable
numbers about the project itself, refreshed from an actual build/test/pack run
(never hand-typed) by `scripts/refresh-stats.mjs`, and the canonical source is
[`version.json`](../../version.json).

![agentspend stats](../../docs/stats-banner.svg)

## Current numbers (v0.1.0)

| Metric | Value |
|---|---|
| Tests passing | 9 / 9 |
| CLI commands | 8 (`spend track/report/budget`, `sync save/load/list`, 2 command groups) |
| Runtime dependencies | 1 (`commander`) |
| Dev dependencies | 5 |
| Packed tarball size | 4.7 KB |
| Unpacked size | 12.3 KB |
| Files in published package | 11 |

## Refreshing these numbers

```bash
node scripts/refresh-stats.mjs        # recompute stats into version.json
node scripts/generate-stats-banner.mjs  # regenerate docs/stats-banner.svg from version.json
```

`refresh-stats.mjs` builds the project, runs the real test suite, measures the actual
`npm pack` output, and counts real dependencies/commands from `package.json` and
`src/cli.ts` — it refuses to write `version.json` if any test fails, so a stale or
green-washed number can't get committed.
