"use client";
import { useEffect } from "react";
import { useEnhancedNodesStore } from "@/stores";

export function NodesStoreInitializer({ children }: { children: React.ReactNode }) {
  const { loadNodes } = useEnhancedNodesStore();
  
  useEffect(() => {
    loadNodes({}, { showToast: false });
  }, [loadNodes]);
  
  return <>{children}</>;
}
