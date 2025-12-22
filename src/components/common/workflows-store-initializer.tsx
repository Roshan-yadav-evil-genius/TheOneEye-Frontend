"use client";
import { useEffect } from "react";
import { useWorkflowListStore } from "@/stores";
import { logger } from "@/lib/logging";

export function WorkflowsStoreInitializer({ children }: { children: React.ReactNode }) {
  const { loadWorkflows, error, workflows } = useWorkflowListStore();
  
  useEffect(() => {
    // Only load if we don't have workflows and there's no error
    if (workflows.length === 0 && !error) {
      logger.info('Initializing workflows store', undefined, 'workflows-initializer');
      loadWorkflows().catch((err) => {
        logger.error('Failed to load workflows in initializer', err, 'workflows-initializer');
      });
    }
  }, [loadWorkflows, workflows.length, error]);
  
  return <>{children}</>;
}
