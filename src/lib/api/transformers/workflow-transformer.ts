/**
 * Workflow Data Transformer
 * 
 * Single responsibility: Transform data between backend and frontend formats.
 * Handles all workflow-related data transformations.
 */
import { TWorkflow } from '@/types';
import { WorkflowType } from '@/types/common/constants';
import { BaseTransformer } from './base-transformer';

/**
 * Backend workflow response format
 */
export interface BackendWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow_type?: string;  // 'production' | 'api'
  status: string;
  last_run?: string;
  next_run?: string;
  runs_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  task_id?: string;
}

/**
 * Workflow Transformer Class
 * Uses base transformer pattern for consistency
 */
class WorkflowTransformer extends BaseTransformer<BackendWorkflow, TWorkflow> {
  toFrontend(backend: BackendWorkflow): TWorkflow {
    return {
      id: backend.id,
      name: backend.name,
      description: backend.description,
      category: backend.category,
      workflow_type: backend.workflow_type as WorkflowType | undefined,
      nodes: [],
      connections: [],
      status: backend.status as 'active' | 'inactive' | 'error',
      lastRun: backend.last_run,
      nextRun: backend.next_run,
      runsCount: backend.runs_count,
      tags: backend.tags || [],
      createdAt: backend.created_at,
      updatedAt: backend.updated_at,
      createdBy: backend.created_by,
      taskId: backend.task_id,
    };
  }

  toBackend(frontend: Partial<TWorkflow>): Partial<BackendWorkflow> {
    return {
      name: frontend.name,
      description: frontend.description,
      category: frontend.category,
      workflow_type: frontend.workflow_type,
      status: frontend.status,
      runs_count: frontend.runsCount,
      tags: frontend.tags,
      created_by: frontend.createdBy,
    };
  }
}

// Create singleton instance
const workflowTransformer = new WorkflowTransformer();

/**
 * Transform backend workflow to frontend format
 */
export function transformBackendWorkflowToFrontend(
  backendWorkflow: BackendWorkflow
): TWorkflow {
  return workflowTransformer.toFrontend(backendWorkflow);
}

/**
 * Transform frontend workflow to backend format
 */
export function transformFrontendWorkflowToBackend(
  frontendWorkflow: Partial<TWorkflow>
): Partial<BackendWorkflow> {
  return workflowTransformer.toBackend(frontendWorkflow);
}

/**
 * Transform array of backend workflows to frontend format
 */
export function transformBackendWorkflowsToFrontend(
  backendWorkflows: BackendWorkflow[]
): TWorkflow[] {
  return workflowTransformer.toFrontendArray(backendWorkflows);
}

