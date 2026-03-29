"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getItem, setItem } from "~/lib/storage";


export interface User {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  register: (user: User, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_KEY = "auth_user";
const ACCOUNTS_KEY = "auth_accounts";

interface StoredAccount {
  user: User;
  password: string;
}

// Default demo account
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    user: {
      name: "Nguyễn Văn A",
      email: "demo@haingoc.com.vn",
      phone: "0901234567",
      company: "Công ty TNHH Demo",
    },
    password: "123456",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getItem<User>(AUTH_KEY);
    if (stored) setUser(stored);
    // Seed default accounts if none exist
    if (!getItem<StoredAccount[]>(ACCOUNTS_KEY)) {
      setItem(ACCOUNTS_KEY, DEFAULT_ACCOUNTS);
    }
    setIsLoading(false);
  }, []);

  function login(email: string, password: string): boolean {
    const accounts = getItem<StoredAccount[]>(ACCOUNTS_KEY) ?? DEFAULT_ACCOUNTS;
    const match = accounts.find(
      (a) => a.user.email === email && a.password === password,
    );
    if (match) {
      setUser(match.user);
      setItem(AUTH_KEY, match.user);
      return true;
    }
    return false;
  }

  function register(newUser: User, password: string): boolean {
    const accounts = getItem<StoredAccount[]>(ACCOUNTS_KEY) ?? DEFAULT_ACCOUNTS;
    if (accounts.some((a) => a.user.email === newUser.email)) {
      return false; // email exists
    }
    const updated = [...accounts, { user: newUser, password }];
    setItem(ACCOUNTS_KEY, updated);
    setUser(newUser);
    setItem(AUTH_KEY, newUser);
    return true;
  }

  function logout() {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("haingoc_v2_" + AUTH_KEY);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
