"use client";

import { useWorkflowListStore } from "@/stores";
import { WorkflowPage } from "./WorkflowPage";

export function WorkflowPageContainer() {
  const { workflows, isLoading } = useWorkflowListStore();


  return <WorkflowPage workflows={workflows} isLoading={isLoading} />;
}
