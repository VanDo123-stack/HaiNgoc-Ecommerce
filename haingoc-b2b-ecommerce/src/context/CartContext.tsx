"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { getItem, setItem, migrateV1Keys } from "~/lib/storage";

// 1. Types

export interface CartItem {
  slug: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (slug: string, quantity: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  totalItems: number;
}

// 2. Context

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "cart";

const DEFAULT_CART: CartItem[] = [
  { slug: "que-han-kobelco-lb-52-18-e7018-thailand", quantity: 5 },
  { slug: "may-mai-cam-tay-wp13-125-quick-metabogermany", quantity: 2 },
];

// 3. Provider

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Track whether client-side localStorage has been read (SSR safe)
  const mountedRef = useRef(false);

  // On mount: migrate v1 keys, then read persisted cart from localStorage
  useEffect(() => {
    migrateV1Keys();
    const stored = getItem<CartItem[]>(CART_KEY);
    if (Array.isArray(stored) && stored.length > 0) {
      setItems(stored);
    } else {
      setItems(DEFAULT_CART);
    }
    mountedRef.current = true;
  }, []);

  // Persist cart to localStorage whenever items change (after initial mount)
  useEffect(() => {
    if (!mountedRef.current) return;
    setItem(CART_KEY, items);
  }, [items]);

  const addItem = (slug: string, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.slug === slug);
      if (existing) {
        return prev.map((item) =>
          item.slug === slug
            ? { ...item, quantity: Math.min(999, item.quantity + quantity) }
            : item,
        );
      }
      return [...prev, { slug, quantity: Math.min(999, quantity) }];
    });
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(999, Math.max(1, quantity)) }
          : item,
      ),
    );
  };

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 4. Hook

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
