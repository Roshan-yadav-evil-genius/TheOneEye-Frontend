"use client";

import { useEffect } from "react";
import { useWorkflowStore } from "@/stores";
import { WorkflowPage } from "./WorkflowPage";

export function WorkflowPageContainer() {
  const { workflows, loadTWorkflows, isLoading } = useWorkflowStore();

  useEffect(() => {
    loadTWorkflows();
  }, [loadTWorkflows]);

  return <WorkflowPage workflows={workflows} isLoading={isLoading} />;
}
