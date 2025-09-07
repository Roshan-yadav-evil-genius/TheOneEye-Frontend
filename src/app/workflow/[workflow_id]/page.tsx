import React from 'react'
import { Provider } from 'react-redux'
import WorkFlowProvider from './WorkFlowProvider';

export default async function WorkFlowEditorPage({params}: { 
     params: { workflow_id: string };
  }) {
    const { workflow_id } = await params;
  
    return <WorkFlowProvider workflow_id={workflow_id} />
  }