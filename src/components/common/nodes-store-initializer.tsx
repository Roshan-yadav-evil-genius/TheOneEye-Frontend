"use client";
import { useEffect } from "react";
import { useNodesStore } from "@/stores";

export function NodesStoreInitializer({ children }: { children: React.ReactNode }) {
  const { loadNodes } = useNodesStore();
  
  useEffect(() => {
    loadNodes({}, { showToast: false });
  }, [loadNodes]);
  
  return <>{children}</>;
}
