import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { checkBudget, getReport, setBudget, trackSpend } from "../logic/spend.js";

let tempHome: string;

beforeEach(() => {
  tempHome = mkdtempSync(join(tmpdir(), "agentspend-spend-test-"));
  process.env.AGENTSPEND_HOME = tempHome;
});

afterEach(() => {
  rmSync(tempHome, { recursive: true, force: true });
  delete process.env.AGENTSPEND_HOME;
});

test("trackSpend records an entry with a timestamp", () => {
  const entry = trackSpend({ provider: "openai", cost: 0.5, project: "demo" });
  assert.equal(entry.provider, "openai");
  assert.equal(entry.cost, 0.5);
  assert.ok(entry.timestamp);
});

test("getReport totals cost across providers", () => {
  trackSpend({ provider: "openai", cost: 0.4 });
  trackSpend({ provider: "anthropic", cost: 0.1 });
  const report = getReport();
  assert.equal(report.total, 0.5);
  assert.equal(report.byProvider.openai, 0.4);
  assert.equal(report.byProvider.anthropic, 0.1);
});

test("getReport filters by project", () => {
  trackSpend({ provider: "openai", cost: 1, project: "a" });
  trackSpend({ provider: "openai", cost: 2, project: "b" });
  const report = getReport("a");
  assert.equal(report.total, 1);
  assert.equal(report.entries.length, 1);
});

test("checkBudget reports over-budget once spend exceeds the cap", () => {
  setBudget(1);
  trackSpend({ provider: "openai", cost: 0.5 });
  assert.equal(checkBudget().overBudget, false);
  trackSpend({ provider: "openai", cost: 0.6 });
  assert.equal(checkBudget().overBudget, true);
});

test("checkBudget with no budget set is never over budget", () => {
  trackSpend({ provider: "openai", cost: 1000 });
  const status = checkBudget();
  assert.equal(status.budget, null);
  assert.equal(status.overBudget, false);
});
