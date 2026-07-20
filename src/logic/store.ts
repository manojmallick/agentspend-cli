import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".agentops");

export function configDir(): string {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  return CONFIG_DIR;
}

export function readJson<T>(filename: string, fallback: T): T {
  const path = join(configDir(), filename);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function writeJson(filename: string, data: unknown): void {
  const path = join(configDir(), filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
}
