export type UserRole = "user" | "admin";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Paid"
  | "Failed";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  username?: string;
  password?: string;
  phone: string;
  name: string;
  address: string;
  postalCode: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  addresses?: Address[];
  defaultAddressId?: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Article {
  id: string;
  title: string;
  image: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  stock: number;
  preparationTime?: number;
  // Weight fields (grams)
  netWeight?: number; // وزن خالص محصول
  packageWeight?: number; // وزن شامل بسته‌بندی یا وزن دسته‌بندی
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  weight?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
  province: string;
  city: string;
  shippingMethod: "pickup" | "tipax" | "poste_tajazzi";
  shippingCost: number;
  notes: string;
  paymentTrackId?: string;
  paymentReferenceNumber?: string;
  paymentVerifiedAt?: string;
  createdAt: string;
}

export interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialMedia: {
    eitaaChannel?: string;
    eitaaPv?: string;
  };
}

export interface AboutInfo {
  description: string;
}

export interface SiteSettings {
  websiteName: string;
  metaTitle: string;
  metaDescription: string;
  favicon: string;
  logo: string;
  footerText: string;
  footerLinks: { label: string; href: string }[];
  zibalMerchant?: string;
  pickupShippingCost?: number;
  posteTajazziBaseCost?: number;
  posteTajazziRatePerKg?: number;
}

export interface SiteBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonHref: string;
  accent?: string;
}

export interface SessionPayload {
  userId: string;
  role: UserRole;
  phone: string;
}

export interface Review {
  id: string;
  fullName: string;
  comment: string;
  createdAt: string;
}