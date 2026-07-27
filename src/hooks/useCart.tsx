"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import type { CartItem, Product } from "@/types";

function cartItemKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}:${item.size ?? ""}:${item.color ?? ""}`;
}

function wishlistStorageKey(userId?: string | null) {
  return userId ? `boutique_wishlist:${userId}` : "boutique_wishlist";
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  shippingCost: number;
  totalWithShipping: number;
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
  moveToCart: (product: Product, quantity?: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "boutique_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingRatePerKg, setShippingRatePerKg] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    // fetch settings for shipping rate
    let mounted = true;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.success && typeof data.data.shippingRatePerKg === 'number') {
          setShippingRatePerKg(data.data.shippingRatePerKg || 0);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  useEffect(() => {
    if (loading) return;

    try {
      const stored = window.localStorage.getItem(wishlistStorageKey(user?.id ?? null));
      setWishlistItems(stored ? JSON.parse(stored) : []);
    } catch {
      setWishlistItems([]);
    }

    setWishlistLoaded(true);
  }, [loading, user?.id]);

  useEffect(() => {
    if (!wishlistLoaded || loading) return;

    window.localStorage.setItem(
      wishlistStorageKey(user?.id ?? null),
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems, wishlistLoaded, loading, user?.id]);

  const addItem = useCallback((item: CartItem) => {
    const key = cartItemKey(item);
    setItems((prev) => {
      const existing = prev.find((i) => cartItemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartItemKey(i) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, size?: string, color?: string) => {
      const key = cartItemKey({ productId, size, color });
      setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      const key = cartItemKey({ productId, size, color });
      setItems((prev) =>
        prev.map((i) => (cartItemKey(i) === key ? { ...i, quantity } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [product, ...prev];
    });
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [product, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  const clearWishlist = useCallback(() => setWishlistItems([]), []);

  const moveToCart = useCallback(
    (product: Product, quantity = 1) => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/Image/placeholder-product.svg",
        weight: (product.netWeight || 0) + (product.packageWeight || 0),
        quantity,
        packageWeight: undefined
      });
      removeFromWishlist(product.id);
    },
    [addItem, removeFromWishlist]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const totalWeightGrams = items.reduce((sum, i) => sum + ((i.weight || 0) * i.quantity), 0);
  const totalWeightKg = totalWeightGrams / 1000;
  const shippingCost = shippingRatePerKg ? shippingRatePerKg * totalWeightKg : 0;
  const totalWithShipping = totalPrice + shippingCost;
  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
          totalPrice,
          shippingCost,
          totalWithShipping,
        wishlistItems,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
        wishlistCount,
        moveToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
