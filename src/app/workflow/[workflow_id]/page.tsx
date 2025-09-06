import { backendService } from '@/app/services/backend'
import React from 'react'
import SideBar from '../components/SideBar'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const WorkFlowEditor = async ({ params }: { params: Promise<{ workflow_id: string }> }) => {
    const workflow_id = (await params).workflow_id
    const workFlow = await backendService.getWorkFlow(workflow_id)
    const workflow_nodes = await backendService.getWorkFlowNodes(workflow_id)
    const workflow_connections = await backendService.getWorkFlowConnections(workflow_id)

    console.log(
        "🚀 Workflow loaded:", workFlow,
        "🧩 Nodes:", workflow_nodes,
        "🔗 Connections:", workflow_connections);
        
    return (
        <section className="WorkFlowEditor">
            <header>
                {workFlow.name} ({workFlow.id})
            </header>
            <main className="grid grid-cols-[200px_1fr] min-h-0 flex-1">
                <div className="sidebar bg-gray-700">
                    <SideBar />
                </div>
                <div className="body">
                    <ReactFlow

                        fitView
                    />
                </div>
            </main>
            <footer></footer>
        </section>
    )
}

export default WorkFlowEditor