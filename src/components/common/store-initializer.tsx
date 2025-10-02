"use client";

import { useEffect } from "react";
import { initializeStores } from "@/stores";

interface StoreInitializerProps {
  children: React.ReactNode;
}

export function StoreInitializer({ children }: StoreInitializerProps) {
  useEffect(() => {
    // Initialize all stores with default data
    initializeStores();
  }, []);

  return <>{children}</>;
}
