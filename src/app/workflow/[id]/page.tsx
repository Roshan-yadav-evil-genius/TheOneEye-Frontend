import { WorkflowLayout } from "@/components/workflow/workflow-layout"

interface WorkflowPageProps {
  params: {
    id: string
  }
}

export default function WorkflowPage({ params }: WorkflowPageProps) {
  return <WorkflowLayout workflowId={params.id} />
}