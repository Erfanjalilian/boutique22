import { promises as fs } from "fs";
import path from "path";

const PROJECT_DATA_DIR = path.resolve(process.cwd(), "data");

async function getDataFilePath(filename: string): Promise<string> {
  await fs.mkdir(PROJECT_DATA_DIR, { recursive: true });
  return path.join(PROJECT_DATA_DIR, filename);
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

export const DATA_DIR = PROJECT_DATA_DIR;
