# agentspend

Track and cap AI agent API spend, and sync agent config/state across environments.

Local-first, free CLI — no server, no account, everything lives in `~/.agentspend`
(or `$AGENTSPEND_HOME` if set).

![agentspend stats](../docs/stats-banner.svg)

## Guides

- [CLI reference](guide/cli.md) — every `spend` and `sync` command
- [Roadmap](guide/roadmap.md) — what shipped, what's next
- [Project stats](guide/stats.md) — real, current numbers (tests, package size, dependencies)

## Quick start

```bash
npm install -g agentspend-cli
agentspend spend track --provider openai --cost 0.42
agentspend spend report
```

See the [main README](../README.md) for the full command list.
