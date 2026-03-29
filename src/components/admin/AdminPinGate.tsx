"use client";

import { useState, useEffect } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const ADMIN_PIN = "1234";

export function AdminPinGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("haingoc_admin_auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem("haingoc_admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("Mã PIN không đúng. Vui lòng thử lại.");
      setPin("");
    }
  }

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
          <h1 className="mb-6 text-center text-xl font-semibold">
            Quản trị viên
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Nhập mã PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="text-center text-lg"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" size="lg">
              Truy cập quản trị
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
