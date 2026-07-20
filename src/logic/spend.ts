import { readJson, writeJson } from "./store.js";

export interface SpendEntry {
  timestamp: string;
  provider: string;
  model?: string;
  cost: number;
  project?: string;
}

interface SpendData {
  entries: SpendEntry[];
  budget: number | null;
}

const FILE = "spend.json";

function load(): SpendData {
  return readJson<SpendData>(FILE, { entries: [], budget: null });
}

function save(data: SpendData): void {
  writeJson(FILE, data);
}

export function trackSpend(entry: Omit<SpendEntry, "timestamp">): SpendEntry {
  const data = load();
  const full: SpendEntry = { ...entry, timestamp: new Date().toISOString() };
  data.entries.push(full);
  save(data);
  return full;
}

export function setBudget(amount: number): void {
  const data = load();
  data.budget = amount;
  save(data);
}

export function getReport(project?: string): {
  total: number;
  budget: number | null;
  byProvider: Record<string, number>;
  entries: SpendEntry[];
} {
  const data = load();
  const entries = project ? data.entries.filter((e) => e.project === project) : data.entries;
  const byProvider: Record<string, number> = {};
  let total = 0;
  for (const e of entries) {
    total += e.cost;
    byProvider[e.provider] = (byProvider[e.provider] ?? 0) + e.cost;
  }
  return { total, budget: data.budget, byProvider, entries };
}

export function checkBudget(project?: string): { overBudget: boolean; total: number; budget: number | null } {
  const { total, budget } = getReport(project);
  return { overBudget: budget !== null && total > budget, total, budget };
}
