import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { getAdminSessionOrFallback } from "@/lib/auth";
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
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  stock: z.number().min(0).optional(),
  preparationTime: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
});

async function requireAdmin() {
  const session = await getAdminSessionOrFallback();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0].message);

  try {
    const products = await readProductsFile();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return apiError("Product not found", 404);

    products[idx] = { ...products[idx], ...parsed.data };
    await writeProductsFile(products);
    return apiSuccess(products[idx]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return apiError("Unauthorized", 401);

  const { id } = await params;
  try {
    const products = await readProductsFile();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      return apiError("Product not found", 404);
    }
    await writeProductsFile(filtered);
    return apiSuccess({ message: "Product deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return apiError(message, 500);
  }
}
