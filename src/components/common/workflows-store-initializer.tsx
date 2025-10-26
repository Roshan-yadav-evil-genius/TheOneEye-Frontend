"use client";
import { useEffect } from "react";
import { useWorkflowStore } from "@/stores";

export function WorkflowsStoreInitializer({ children }: { children: React.ReactNode }) {
  const { loadTWorkflows } = useWorkflowStore();
  
  useEffect(() => {
    loadTWorkflows();
  }, [loadTWorkflows]);
  
  return <>{children}</>;
}
