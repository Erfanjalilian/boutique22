import { promises as fs } from "fs";
import path from "path";

function getCandidateDataDirs(): string[] {
  const configuredDir = process.env.DATA_DIR?.trim();
  const candidates = [
    configuredDir,
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "..", "data"),
    path.join("/var", "www", "data"),
    path.join("/tmp", "boutique-data"),
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set(candidates));
}

let cachedDataDir: string | null = null;

async function resolveDataDir(): Promise<string> {
  if (cachedDataDir) {
    return cachedDataDir;
  }

  for (const dir of getCandidateDataDirs()) {
    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.access(dir);
      cachedDataDir = dir;
      return dir;
    } catch {
      // Try the next candidate directory.
    }
  }

  throw new Error("Unable to find a writable data directory for the app.");
}

async function getDataFilePath(filename: string): Promise<string> {
  const dataDir = await resolveDataDir();
  return path.join(dataDir, filename);
}

export async function readJson<T>(filename: string): Promise<T> {
  try {
    const filePath = await getDataFilePath(filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = await getDataFilePath(filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readJsonObject<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = await getDataFilePath(filename);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export const DATA_DIR = path.join(process.cwd(), "data");
