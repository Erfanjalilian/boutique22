import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type {
  User,
  Product,
  Order,
  Category,
  Size,
  Color,
  Article,
  OtpRecord,
  ContactInfo,
  AboutInfo,
  SiteSettings,
  SiteBanner,
  OrderStatus,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code?: string }).code;
      if (code === "ENOENT") {
        return fallback;
      }
    }

    throw error;
  }
}

async function readJsonObject<T>(fileName: string, fallback: T): Promise<T> {
  return readJson<T>(fileName, fallback);
}

async function writeJson<T>(fileName: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, fileName);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getUsers(): Promise<User[]> {
  return readJson<User[]>("users.json", []);
}

export async function saveUsers(users: User[]): Promise<void> {
  await writeJson("users.json", users);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function getUserByPhone(phone: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.phone === phone);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.username === username);
}

export async function getProducts(): Promise<Product[]> {
  return readJson<Product[]>("products.json", []);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson("products.json", products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getOrders(): Promise<Order[]> {
  return readJson<Order[]>("orders.json", []);
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await writeJson("orders.json", orders);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter((o) => o.userId === userId);
}

export async function getCategories(): Promise<Category[]> {
  return readJson<Category[]>("categories.json", []);
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await writeJson("categories.json", categories);
}

export async function getSizes(): Promise<Size[]> {
  return readJson<Size[]>("sizes.json", []);
}

export async function saveSizes(sizes: Size[]): Promise<void> {
  await writeJson("sizes.json", sizes);
}

export async function getColors(): Promise<Color[]> {
  return readJson<Color[]>("colors.json", []);
}

export async function saveColors(colors: Color[]): Promise<void> {
  await writeJson("colors.json", colors);
}

export async function getArticles(): Promise<Article[]> {
  return readJson<Article[]>("articles.json", []);
}

export async function saveArticles(articles: Article[]): Promise<void> {
  await writeJson("articles.json", articles);
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.id === id);
}

export async function getOtps(): Promise<OtpRecord[]> {
  return readJson<OtpRecord[]>("otps.json", []);
}

export async function saveOtps(otps: OtpRecord[]): Promise<void> {
  await writeJson("otps.json", otps);
}

export async function getSettings(): Promise<SiteSettings> {
  return readJsonObject<SiteSettings>("settings.json", {
    websiteName: "بوتیک",
    metaTitle: "بوتیک - فروشگاه پوشاک",
    metaDescription: "",
    favicon: "/Image/logo.svg",
    logo: "/Image/logo.svg",
    footerText: "",
    footerLinks: [],
  });
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await writeJson("settings.json", settings);
}

export async function getAbout(): Promise<AboutInfo> {
  return readJsonObject<AboutInfo>("about.json", {
    description: "",
    story: "",
    mission: "",
    vision: "",
    additionalContent: "",
  });
}

export async function saveAbout(about: AboutInfo): Promise<void> {
  await writeJson("about.json", about);
}

export async function getContact(): Promise<ContactInfo> {
  return readJsonObject<ContactInfo>("contact.json", {
    phone: "",
    email: "",
    address: "",
    socialMedia: {},
  });
}

export async function saveContact(contact: ContactInfo): Promise<void> {
  await writeJson("contact.json", contact);
}

export async function getBanners(): Promise<SiteBanner[]> {
  return readJson<SiteBanner[]>("banners.json", []);
}

export async function saveBanners(banners: SiteBanner[]): Promise<void> {
  await writeJson("banners.json", banners);
}

export async function getDashboardStats() {
  const [products, orders, users] = await Promise.all([
    getProducts(),
    getOrders(),
    getUsers(),
  ]);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.filter((u) => u.role === "user").length,
    recentOrders,
  };
}

export type { OrderStatus };
