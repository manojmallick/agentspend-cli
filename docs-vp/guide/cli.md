# CLI reference

All 8 agentops commands (2 command groups, 3 subcommands each, plus the top-level `--version`/`--help` flags).

## Quick reference

| Command | Description |
|---|---|
| `agentops spend track` | Record a spend entry |
| `agentops spend report` | Show spend totals |
| `agentops spend budget` | Set or check the spend budget |
| `agentops sync save` | Save a local file as a named profile |
| `agentops sync load` | Write a saved profile to a destination path |
| `agentops sync list` | List saved profiles |

## spend track

Records one spend entry (provider, optional model, cost, optional project label) to `~/.agentops/spend.json`.

```bash
agentops spend track --provider openai --model gpt-4o --cost 0.42 --project myagent
# Recorded $0.4200 for openai (myagent)
```

| Option | Required | Description |
|---|---|---|
| `--provider <provider>` | yes | e.g. `openai`, `anthropic` |
| `--cost <cost>` | yes | Cost in USD |
| `--model <model>` | no | Model name |
| `--project <project>` | no | Project/agent label, used to scope reports |

## spend report

Totals recorded spend, optionally scoped to a project, optionally as JSON.

```bash
agentops spend report
# Total spend: $0.5200
# Budget: $10.00
# By provider:
#   openai: $0.4200
#   anthropic: $0.1000

agentops spend report --project myagent --json
```

| Option | Description |
|---|---|
| `--project <project>` | Filter to entries with this project label |
| `--json` | Output the full report as JSON |

## spend budget

Sets a budget (with an argument) or checks status against it (with none). Checking exits `1` when over budget, so it can gate a CI job.

```bash
agentops spend budget 10.00
# Budget set to $10.00

agentops spend budget
# Spend: $10.52 / Budget: $10.00
# Over budget!
```

| Argument/Option | Description |
|---|---|
| `[amount]` | Set the budget to this USD amount; omit to check status |
| `--project <project>` | Scope the check to one project |

## sync save

Copies a local file into `~/.agentops/profiles/<name>`.

```bash
agentops sync save myagent ./agent-config.json
# Saved profile "myagent" -> /Users/you/.agentops/profiles/myagent
```

## sync load

Copies a saved profile back out to a destination path.

```bash
agentops sync load myagent ./restored-config.json
# Loaded profile "myagent" -> ./restored-config.json
```

Errors cleanly (exit `1`, no stack trace) if the profile was never saved.

## sync list

Lists all saved profile names.

```bash
agentops sync list
# myagent
```
