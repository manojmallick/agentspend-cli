import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { configDir } from "./store.js";

function profilesDir(): string {
  const dir = join(configDir(), "profiles");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

export function saveProfile(name: string, sourceFile: string): string {
  if (!existsSync(sourceFile) || !statSync(sourceFile).isFile()) {
    throw new Error(`Source file not found: ${sourceFile}`);
  }
  const dest = join(profilesDir(), name);
  copyFileSync(sourceFile, dest);
  return dest;
}

export function loadProfile(name: string, destFile: string): string {
  const source = join(profilesDir(), name);
  if (!existsSync(source)) {
    throw new Error(`No saved profile named "${name}". Run "agentspend sync save ${name} <file>" first.`);
  }
  copyFileSync(source, destFile);
  return destFile;
}

export function listProfiles(): string[] {
  const dir = profilesDir();
  return readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile());
}
