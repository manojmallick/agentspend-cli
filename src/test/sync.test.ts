import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { listProfiles, loadProfile, saveProfile } from "../logic/sync.js";

let tempHome: string;
let sourceFile: string;

beforeEach(() => {
  tempHome = mkdtempSync(join(tmpdir(), "agentspend-sync-test-"));
  process.env.AGENTSPEND_HOME = tempHome;
  sourceFile = join(tempHome, "source.json");
  writeFileSync(sourceFile, JSON.stringify({ model: "gpt-4o" }));
});

afterEach(() => {
  rmSync(tempHome, { recursive: true, force: true });
  delete process.env.AGENTSPEND_HOME;
});

test("saveProfile copies the source file into the profile store", () => {
  saveProfile("myagent", sourceFile);
  assert.deepEqual(listProfiles(), ["myagent"]);
});

test("loadProfile restores a saved profile to a destination path", () => {
  saveProfile("myagent", sourceFile);
  const dest = join(tempHome, "restored.json");
  loadProfile("myagent", dest);
  assert.equal(readFileSync(dest, "utf8"), JSON.stringify({ model: "gpt-4o" }));
});

test("saveProfile throws for a missing source file", () => {
  assert.throws(() => saveProfile("x", join(tempHome, "nope.json")), /not found/);
});

test("loadProfile throws for a profile that was never saved", () => {
  assert.throws(() => loadProfile("nope", join(tempHome, "out.json")), /No saved profile/);
});
