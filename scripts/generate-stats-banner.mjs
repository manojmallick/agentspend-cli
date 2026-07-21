#!/usr/bin/env node
/**
 * generate-stats-banner.mjs
 *
 * Renders docs/stats-banner.svg from version.json's real stats block.
 * Four tiles, no fabricated "before/after" comparison — just what's true
 * right now: tests, package size, dependencies, CLI commands.
 *
 * Usage:
 *   node scripts/generate-stats-banner.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const version = JSON.parse(readFileSync(join(ROOT, "version.json"), "utf8"));
const { version: ver, stats } = version;

const tiles = [
  { label: "TESTS PASSING", value: `${stats.tests_passing}/${stats.tests_total}` },
  { label: "PACKAGE SIZE", value: `${stats.package_packed_kb} KB` },
  { label: "DEPENDENCIES", value: `${stats.runtime_dependencies} runtime` },
  { label: "CLI COMMANDS", value: `${stats.cli_commands}` },
];

const tileWidth = 190;
const tileHeight = 110;
const gap = 16;
const padding = 24;
const width = padding * 2 + tiles.length * tileWidth + (tiles.length - 1) * gap;
const height = 210;

const tileSvgs = tiles
  .map((tile, i) => {
    const x = padding + i * (tileWidth + gap);
    const y = 80;
    return `
    <rect x="${x}" y="${y}" width="${tileWidth}" height="${tileHeight}" rx="12" fill="#1e1b2e" stroke="#3a3454" stroke-width="1"/>
    <text x="${x + tileWidth / 2}" y="${y + 48}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="26" font-weight="700" fill="#f5f3ff">${tile.value}</text>
    <text x="${x + tileWidth / 2}" y="${y + 78}" text-anchor="middle" font-family="ui-sans-serif, sans-serif" font-size="12" letter-spacing="0.08em" fill="#a89ad6">${tile.label}</text>`;
  })
  .join("\n");

const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="agentops v${ver} stats: ${tiles.map((t) => `${t.label} ${t.value}`).join(", ")}">
  <rect width="${width}" height="${height}" rx="16" fill="#131120"/>
  <text x="${padding}" y="42" font-family="ui-sans-serif, sans-serif" font-size="24" font-weight="700" fill="#f5f3ff">agentops</text>
  <text x="${padding}" y="62" font-family="ui-monospace, monospace" font-size="13" fill="#7c6af7">v${ver}</text>
${tileSvgs}
</svg>
`;

writeFileSync(join(ROOT, "docs", "stats-banner.svg"), svg);
console.log("Wrote docs/stats-banner.svg");
