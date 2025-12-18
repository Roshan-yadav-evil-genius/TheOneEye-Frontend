"use client";
import { useEffect } from "react";
import { useWorkflowListStore } from "@/stores";

export function WorkflowsStoreInitializer({ children }: { children: React.ReactNode }) {
  const { loadWorkflows } = useWorkflowListStore();
  
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);
  
  return <>{children}</>;
}
