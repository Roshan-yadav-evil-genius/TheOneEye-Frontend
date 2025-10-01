import { WorkflowLayout } from "@/components/workflow/workflow-layout"

interface WorkflowPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { id } = await params
  return <WorkflowLayout workflowId={id} />
}