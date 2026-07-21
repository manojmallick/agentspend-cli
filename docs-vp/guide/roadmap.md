# Roadmap

**Stats:** 9 tests passing · 8 CLI commands · 1 runtime dependency · 4.7 KB packed

### v0.1.0 — first release ✓

Initial `spend` (track/report/budget-cap) and `sync` (save/load/list) CLI, published
as `agentspend-cli` on npm (the `agentops` npm name was already taken by an unrelated
package — the project itself, including its GitHub repo and CLI command, was later
renamed from "agentops" to "agentspend" for consistency with the npm package name).
Local-only storage in `~/.agentspend`, no server, no account.

**Tags:** spend-tracking, config-sync, npm-publish, changesets

**Impact:** 9/9 tests passing, 4.7 KB packed tarball, single runtime dependency
(commander).

### Current milestone

Nothing planned yet beyond v0.1.0 — next steps depend on real usage once it's published
and gets its first users. Candidates under consideration, not yet committed:

- CSV export for `spend report`
- Per-provider budget caps (not just a single global budget)
- A hosted dashboard (the "paid" half of the free-CLI-to-paid-dashboard plan)
