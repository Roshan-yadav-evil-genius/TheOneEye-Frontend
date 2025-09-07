'use client'

import { backendService } from '@/app/services/backend'
import SideBar from './SideBar'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, NodeChange, Edge, NodePositionChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';
import { TWorkFlow } from '@/types/backendService';
import { cvtWorkFlowEdgeToReactFlowEdge, cvtWorkflowNodeToReactFlowNode } from '@/lib/typeConverter';
import { Node } from "@xyflow/react"
import { customNodeTypes } from '@/NodeType/constants';
import { ENodeTypes } from '@/types/nodeConnection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setWorkFlowId } from '@/store/Slices/WorkFlow';


const WorkFlowEditor = ({WorkFlow_id}:{WorkFlow_id:string}) => {
    const dispatch = useDispatch()

    const [workflow, setWorkflow] = useState<TWorkFlow | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<Edge[]>([]);

    useEffect(()=>{
        dispatch(setWorkFlowId({id:WorkFlow_id}))
    },[])

    useEffect(() => {
        if (!WorkFlow_id) return;

        const fetchWorkflow = async () => {
            const workflowInfo = await backendService.getWorkFlow(WorkFlow_id);
            const workflowNodes = await backendService.getWorkFlowNodes(WorkFlow_id);
            const workflowConnections = await backendService.getWorkFlowConnections(WorkFlow_id);
            setWorkflow(workflowInfo)
            setNodes(workflowNodes.map(node => cvtWorkflowNodeToReactFlowNode(node)))
            setConnections(workflowConnections.map(edge => cvtWorkFlowEdgeToReactFlowEdge(edge)))
        };

        fetchWorkflow();
    }, [WorkFlow_id]);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {

            // Node Position Manipulation Occured
            const positionChanged = changes.filter((change): change is NodePositionChange => change.type === 'position' && change.dragging === false)
            if (positionChanged.length > 0 && WorkFlow_id) {
                positionChanged.forEach(async (nodeChange) => {
                    if (!nodeChange.position) return;
                    await backendService.patchWorkFlowNodePosition(WorkFlow_id, nodeChange.id, nodeChange.position)
                })
            }


            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
        },
        []);

    const addNode = async (nodeType: ENodeTypes) => {
        if (!WorkFlow_id) return;
        const WorkFlowNewNode = await backendService.postWorkFlowNode(WorkFlow_id, nodeType)
        const ReactFlowNewNode = cvtWorkflowNodeToReactFlowNode(WorkFlowNewNode)
        setNodes((nodesSnapshot) => [...nodesSnapshot, ReactFlowNewNode])
    }



    return (
        <section className="p-2 min-h-screen grid gap-2 grid-rows-[min-content_1fr_min-content]">
            <nav className="border rounded p-2 flex gap-2">
                <Link href="/workflow/34/45" className='underline text-blue-700'>NotFound</Link>
                <button >WorkFlows</button>
            </nav>
            <main className="grid grid-cols-[300px_1fr] gap-2 border rounded not-first-of-type: p-2 min-h-0 h-full">
                <SideBar addNode={addNode} />
                <div className="border rounded m-2 p-2">
                    <ReactFlow
                        nodeTypes={customNodeTypes}

                        onNodesChange={onNodesChange}
                        nodes={nodes}

                        edges={connections}

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