"use client";

import { useWorkflowStore } from "@/stores";
import { WorkflowPage } from "./WorkflowPage";

export function WorkflowPageContainer() {
  const { workflows, isLoading } = useWorkflowStore();


  return <WorkflowPage workflows={workflows} isLoading={isLoading} />;
}
