"use client";

import { useEffect } from "react";
import { useWorkflowStore } from "@/stores";
import { WorkflowPage } from "./WorkflowPage";

export function WorkflowPageContainer() {
  const { workflows, loadTWorkflows, isLoading } = useWorkflowStore();


  return <WorkflowPage workflows={workflows} isLoading={isLoading} />;
}
