import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { generateId } from "@/utils/helpers";
import { apiSuccess, apiError } from "@/utils/api";
import type { Product } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

async function readProductsFile(): Promise<Product[]> {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    const content = await readFile(PRODUCTS_FILE, "utf8");
    return JSON.parse(content) as Product[];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code?: string }).code;
      if (code === "ENOENT") {
        return [];
      }
    }

    throw error;
  }
}

async function writeProductsFile(products: Product[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
}

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().min(0),
  images: z.array(z.string()),
  categoryId: z.string(),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  stock: z.number().min(0),
  preparationTime: z.number().min(0).optional().default(0),
  netWeight: z.number().min(0).optional().default(0),
  packageWeight: z.number().min(0).optional().default(0),
});

export async function GET() {
  const products = await readProductsFile();
  return apiSuccess(products);
}

export async function POST(request: Request) {

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0].message);

    const products = await readProductsFile();
    const product = {
      id: generateId(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };
    products.push(product);
    await writeProductsFile(products);
    return apiSuccess(product, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}
