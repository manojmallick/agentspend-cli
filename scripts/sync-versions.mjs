#!/usr/bin/env node
/**
 * sync-versions.mjs
 *
 * Syncs the agentspend version across package.json and version.json.
 * agentspend is a single-package repo, so this is a two-file sync — kept as
 * its own script (rather than hand-editing) so the two files never drift.
 *
 * Usage:
 *   node scripts/sync-versions.mjs 0.2.0
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Usage: node scripts/sync-versions.mjs <x.y.z>");
  process.exit(1);
}

function updateJsonVersion(relPath) {
  const abs = join(ROOT, relPath);
  const json = JSON.parse(readFileSync(abs, "utf8"));
  json.version = version;
  writeFileSync(abs, JSON.stringify(json, null, 2) + "\n");
  console.log(`  ✓ ${relPath}`);
}

console.log(`Syncing versions to ${version}`);
updateJsonVersion("package.json");
updateJsonVersion("version.json");
console.log("Done. Run scripts/refresh-stats.mjs to recompute test/package stats.");
