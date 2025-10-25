"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WorkflowLayout } from "@/components/features/workflow/workflow-layout";
import { ApiService } from "@/lib/api/api-service";
import { TWorkflow } from "@/types";

interface WorkflowDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: WorkflowDetailPageProps) {
  const resolvedParams = React.use(params);
  const workflowId = resolvedParams.id;
  const [workflow, setWorkflow] = useState<TWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to load the workflow
        const workflowData = await ApiService.getWorkflows();
        const foundWorkflow = workflowData.find(w => w.id === workflowId);
        
        if (foundWorkflow) {
          setWorkflow(foundWorkflow);
        } else {
          setError(`Workflow with ID "${workflowId}" not found`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workflow');
      } finally {
        setIsLoading(false);
      }
    };

    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId]);

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 lg:px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/workflow">
                <Button variant="outline" size="sm">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Back to Workflows
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <IconLoader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <h2 className="text-lg font-semibold mb-2">Loading Workflow</h2>
                <p className="text-muted-foreground">
                  Please wait while we load the workflow data...
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !workflow) {
    return (
      <DashboardLayout>
        <div className="px-4 lg:px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/workflow">
                <Button variant="outline" size="sm">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Back to Workflows
                </Button>
              </Link>
            </div>
            <div className="text-center py-12">
              <div className="text-destructive mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Workflow Not Found</h1>
              <p className="text-muted-foreground mb-4">
                {error || `The workflow with ID "${workflowId}" could not be found.`}
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
                <Link href="/workflow">
                  <Button>
                    Back to Workflows
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Success state - render the workflow
  return (
    <div className="">
      <WorkflowLayout workflowId={workflowId} />
    </div>
  );
}