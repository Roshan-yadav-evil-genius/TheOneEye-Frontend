'use client'

import { backendService } from '@/app/services/backend'
import SideBar from './SideBar'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, NodeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { WorkFlow, WorkflowNode } from '@/types/backendService';
import { cvtWorkflowNodeToReactFlowNode } from '@/lib/utils';
import { Node } from "@xyflow/react"
import { customNodeTypes } from '@/NodeType/constants';


const WorkFlowEditor = ({ params }: { params: Promise<{ workflow_id: string }> }) => {
    const [workflow, setWorkflow] = useState<WorkFlow | null>(null);
    const [workflowId, setWorkflowId] = useState<string | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<string | null>(null);

    useEffect(() => {
        const initializeParams = async () => {
            const resolvedParams = await params;
            setWorkflowId(resolvedParams.workflow_id);
        };
        initializeParams();
    }, [params]);

    useEffect(() => {
        if (!workflowId) return;

        const fetchWorkflow = async () => {
            const workflowInfo = await backendService.getWorkFlow(workflowId);
            const workflowNodes = await backendService.getWorkFlowNodes(workflowId);
            const workflowConnections = await backendService.getWorkFlowNodes(workflowId);
            setWorkflow(workflowInfo)
            setNodes(workflowNodes.map(node => cvtWorkflowNodeToReactFlowNode(node)))
            // setNodes(workflowConnections)
            console.log(workflowConnections)
        };

        fetchWorkflow();
    }, [workflowId]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        []);



    return (
        <section className="p-2 min-h-screen grid gap-2 grid-rows-[min-content_1fr_min-content]">
            <nav className="border rounded p-2 flex gap-2">
                <Link href="/workflow/34/45" className='underline text-blue-700'>NotFound</Link>
                <button >WorkFlows</button>
            </nav>
            <main className="grid grid-cols-[300px_1fr] gap-2 border rounded not-first-of-type: p-2 min-h-0 h-full">
                <SideBar />
                <div className="border rounded m-2 p-2">
                    <ReactFlow
                        onNodesChange={onNodesChange}
                        nodes={nodes}
                        nodeTypes={customNodeTypes}
                        fitView
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </main>
            <footer className='border rounded p-2'>Footer</footer>
            <header className='border rounded p-2'>
                Workflow: {workflow?.name} ({workflow?.id})
            </header>
        </section>
    )
}

export default WorkFlowEditor