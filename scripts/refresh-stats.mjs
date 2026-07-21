#!/usr/bin/env node
/**
 * refresh-stats.mjs
 *
 * Recomputes agentspend's real project stats (test results, package size,
 * dependency count, command count) and writes them into version.json.
 * These are the only "metrics" agentspend has — no retrieval/token-reduction
 * benchmarks apply here, so this script never fabricates a comparison
 * number; every field is read directly from a real run.
 *
 * Leaves the "version" field untouched — that's owned by sync-versions.mjs.
 *
 * Usage:
 *   node scripts/refresh-stats.mjs
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const path = (rel) => join(ROOT, rel);

function run(cmd, args) {
  return execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8" });
}

console.log("Building...");
run("pnpm", ["build"]);

console.log("Running tests...");
let testOutput;
try {
  testOutput = run("node", ["--test", "dist/test/*.test.js"]);
} catch (err) {
  // node --test exits non-zero on failure but still prints the summary
  testOutput = err.stdout ?? "";
}
const pass = Number(testOutput.match(/ℹ pass (\d+)/)?.[1] ?? 0);
const fail = Number(testOutput.match(/ℹ fail (\d+)/)?.[1] ?? 0);
if (fail > 0) {
  console.error(`${fail} test(s) failed — not updating version.json`);
  process.exit(1);
}

console.log("Measuring package...");
const packJson = JSON.parse(run("npm", ["pack", "--dry-run", "--json"]))[0];

const pkg = JSON.parse(readFileSync(path("package.json"), "utf8"));
const cliSource = readFileSync(path("src/cli.ts"), "utf8");
const commandCount = (cliSource.match(/\.command\(/g) ?? []).length;

const versionJsonPath = path("version.json");
const current = JSON.parse(readFileSync(versionJsonPath, "utf8"));

const updated = {
  ...current,
  generated_at: new Date().toISOString().slice(0, 10),
  stats: {
    tests_total: pass + fail,
    tests_passing: pass,
    cli_commands: commandCount,
    runtime_dependencies: Object.keys(pkg.dependencies ?? {}).length,
    dev_dependencies: Object.keys(pkg.devDependencies ?? {}).length,
    package_packed_kb: +(packJson.size / 1024).toFixed(1),
    package_unpacked_kb: +(packJson.unpackedSize / 1024).toFixed(1),
    package_file_count: packJson.entryCount,
  },
};

writeFileSync(versionJsonPath, JSON.stringify(updated, null, 2) + "\n");
console.log(`Wrote ${versionJsonPath.replace(ROOT, "")}:`);
console.log(JSON.stringify(updated.stats, null, 2));
