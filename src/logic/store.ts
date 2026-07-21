import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function configDir(): string {
  const dir = process.env.AGENTSPEND_HOME ?? join(homedir(), ".agentspend");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
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
