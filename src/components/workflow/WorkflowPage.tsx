import { WorkflowList } from "./workflow-list";

interface WorkflowPageProps {
  workflows: any[];
  isLoading?: boolean;
}

export function WorkflowPage({ workflows, isLoading }: WorkflowPageProps) {
  return (
    <div className="px-4 lg:px-6">
      <main>
        <WorkflowList workflows={workflows} />
      </main>
    </div>
  );
}
