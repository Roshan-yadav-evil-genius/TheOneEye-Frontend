"use client";
import { useEffect } from "react";
import { useTWorkflowStore } from "@/stores";

export function WorkflowsStoreInitializer({ children }: { children: React.ReactNode }) {
  const { loadTWorkflows } = useTWorkflowStore();
  
  useEffect(() => {
    loadTWorkflows();
  }, [loadTWorkflows]);
  
  return <>{children}</>;
}
