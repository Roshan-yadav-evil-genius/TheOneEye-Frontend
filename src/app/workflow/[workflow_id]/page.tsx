import React from 'react'
import WorkFlowProvider from './WorkFlowProvider';

type WorkFlowEditorPageProps = {
    params: Promise<{ workflow_id: string }>
}


export default async function WorkFlowEditorPage({ params }: WorkFlowEditorPageProps) {
    const { workflow_id } = await params;

    return <WorkFlowProvider workflow_id={workflow_id} />
}