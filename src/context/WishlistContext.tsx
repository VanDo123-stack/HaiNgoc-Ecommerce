"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// 1. Types

interface WishlistContextValue {
  slugs: string[];
  addToWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
}

// 2. Context

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = "wishlist";
const STORAGE_KEY = "haingoc_v2_" + WISHLIST_KEY;

// 3. Provider

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  // Track whether client-side localStorage has been read (SSR safe)
  const mountedRef = useRef(false);

  // On mount: read persisted wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSlugs(parsed as string[]);
        }
      }
    } catch {
      // Corrupt data — reset
      localStorage.removeItem(STORAGE_KEY);
    }
    mountedRef.current = true;
  }, []);

  // Persist wishlist to localStorage whenever slugs change (after initial mount)
  useEffect(() => {
    if (!mountedRef.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs]);

  const addToWishlist = (slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  };

  const removeFromWishlist = (slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const isWishlisted = (slug: string): boolean => {
    return slugs.includes(slug);
  };

  const toggleWishlist = (slug: string) => {
    if (slugs.includes(slug)) {
      removeFromWishlist(slug);
    } else {
      addToWishlist(slug);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ slugs, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// 4. Hook

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
