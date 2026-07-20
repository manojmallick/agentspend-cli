#!/usr/bin/env node
import { Command } from "commander";
import { checkBudget, getReport, setBudget, trackSpend } from "./logic/spend.js";
import { listProfiles, loadProfile, saveProfile } from "./logic/sync.js";

const program = new Command();

program.name("agentops").description("Track AI agent spend and sync agent config/state across environments").version("0.1.0");

const spend = program.command("spend").description("Track and cap AI agent API spend");

spend
  .command("track")
  .description("Record a spend entry")
  .requiredOption("--provider <provider>", "e.g. openai, anthropic")
  .option("--model <model>", "model name")
  .requiredOption("--cost <cost>", "cost in USD", parseFloat)
  .option("--project <project>", "project/agent label")
  .action((opts) => {
    const entry = trackSpend(opts);
    console.log(`Recorded $${entry.cost.toFixed(4)} for ${entry.provider}${entry.project ? ` (${entry.project})` : ""}`);
  });

spend
  .command("report")
  .description("Show spend totals")
  .option("--project <project>", "filter by project")
  .option("--json", "output as JSON")
  .action((opts) => {
    const report = getReport(opts.project);
    if (opts.json) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }
    console.log(`Total spend: $${report.total.toFixed(4)}`);
    if (report.budget !== null) console.log(`Budget: $${report.budget.toFixed(2)}`);
    console.log("By provider:");
    for (const [provider, cost] of Object.entries(report.byProvider)) {
      console.log(`  ${provider}: $${cost.toFixed(4)}`);
    }
  });

spend
  .command("budget")
  .description("Set or check the spend budget")
  .argument("[amount]", "set a budget amount in USD; omit to check current status", parseFloat)
  .option("--project <project>", "scope check to a project")
  .action((amount, opts) => {
    if (amount !== undefined && !Number.isNaN(amount)) {
      setBudget(amount);
      console.log(`Budget set to $${amount.toFixed(2)}`);
      return;
    }
    const status = checkBudget(opts.project);
    if (status.budget === null) {
      console.log("No budget set. Run `agentops spend budget <amount>` to set one.");
      return;
    }
    console.log(`Spend: $${status.total.toFixed(4)} / Budget: $${status.budget.toFixed(2)}`);
    if (status.overBudget) {
      console.error("Over budget!");
      process.exitCode = 1;
    }
  });

const sync = program.command("sync").description("Sync agent config/state across environments");

sync
  .command("save")
  .description("Save a local file as a named profile")
  .argument("<name>", "profile name")
  .argument("<file>", "path to the config/state file")
  .action((name, file) => {
    try {
      const dest = saveProfile(name, file);
      console.log(`Saved profile "${name}" -> ${dest}`);
    } catch (err) {
      console.error((err as Error).message);
      process.exitCode = 1;
    }
  });

sync
  .command("load")
  .description("Write a saved profile to a destination path")
  .argument("<name>", "profile name")
  .argument("<file>", "destination path")
  .action((name, file) => {
    try {
      const dest = loadProfile(name, file);
      console.log(`Loaded profile "${name}" -> ${dest}`);
    } catch (err) {
      console.error((err as Error).message);
      process.exitCode = 1;
    }
  });

sync
  .command("list")
  .description("List saved profiles")
  .action(() => {
    const profiles = listProfiles();
    if (profiles.length === 0) {
      console.log("No profiles saved yet.");
      return;
    }
    for (const p of profiles) console.log(p);
  });

program.parse();
