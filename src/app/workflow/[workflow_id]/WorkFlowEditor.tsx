'use client'

import { backendService } from '@/app/services/backend'
import SideBar from './SideBar'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, NodeChange, Edge, NodePositionChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';
import { cvtWorkFlowEdgeToReactFlowEdge, cvtWorkflowNodeToReactFlowNode } from '@/lib/typeConverter';
import { Node } from "@xyflow/react"
import { customNodeTypes } from '@/NodeType/Mappings';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setWorkFlowInfo } from '@/store/Slices/WorkFlow';
import { Button } from '@/components/ui/button';
import { FileClock, Pause, Play } from 'lucide-react';
import Image from "next/image";

const WorkFlowEditor = ({ WorkFlow_id }: { WorkFlow_id: string }) => {
    const workflow = useSelector((state: RootState) => state.WorkFlow)
    const isExecuting = useSelector((state: RootState) => !!state.WorkFlow.task_id);
    const dispatch = useDispatch<AppDispatch>()

    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<Edge[]>([]);

    useEffect(() => {
        dispatch(setWorkFlowInfo(WorkFlow_id))
    }, [])

    useEffect(() => {
        if (!workflow.id) return;
        const fetchWorkflow = async () => {
            const workflowNodes = await backendService.getWorkFlowNodes(workflow.id);
            setNodes(workflowNodes.map(node => cvtWorkflowNodeToReactFlowNode(node)))

            let workflowConnections = await backendService.getWorkFlowConnections(workflow.id);
            setConnections(workflowConnections.map(edge => cvtWorkFlowEdgeToReactFlowEdge(edge)))
        };

        fetchWorkflow();
    }, [workflow]);

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


            setNodes((nds) => applyNodeChanges(changes, nds))
        },
        []);

    const onConnect = useCallback(async (connection: Connection) => {
        const newConnection = await backendService.postWorkFlowConnection(workflow.id, connection)
        setConnections((eds) => [...eds, cvtWorkFlowEdgeToReactFlowEdge(newConnection)]);
    }, [workflow]);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setConnections((eds) => applyEdgeChanges(changes, eds))
    }, [workflow])

    const addNode = async (nodeType_id: string) => {
        if (!WorkFlow_id) return;
        console.log(nodeType_id)
        const WorkFlowNewNode = await backendService.postWorkFlowNode(WorkFlow_id, nodeType_id)
        const ReactFlowNewNode = cvtWorkflowNodeToReactFlowNode(WorkFlowNewNode)
        setNodes((nodesSnapshot) => [...nodesSnapshot, ReactFlowNewNode])
    }


    const start_execution = async () => {
        if (!WorkFlow_id) return;
        const response = await backendService.startWorkFlowExecution(WorkFlow_id)
        console.log(response)
        if (response.task_id) {
            dispatch(setWorkFlowInfo(WorkFlow_id))
        }
    }
    const stop_execution = async () => {
        if (!WorkFlow_id) return;
        const response = await backendService.stopWorkFlowExecution(WorkFlow_id)
        console.log(response)
        if (response.status === "SUCCESS") {
            dispatch(setWorkFlowInfo(WorkFlow_id))
        }
    }



    return (
        <section className="p-2 min-h-screen grid gap-2 grid-rows-[min-content_1fr_min-content]">
            <header className="border rounded p-2 flex gap-2 justify-between items-center">
                <div className='flex flex-col justify-center items-center'>

                    <Image
                        src="/TheOneEyeLogo.png" // public/images/sample.jpg
                        alt="Sample"
                        width={100}
                        height={76.35}
                    />
                    <h1 className='text-2xl font-bold'>TheOneEye</h1>
                </div>

                <div className='flex flex-col items-center'>
                    <p className='font-bold'>

                        {workflow?.name} ({workflow?.id})
                    </p>
                    <nav className='flex items-center gap-5'>
                        <Link href="/workflow/" className='underline text-blue-700'>WorkFlow</Link>
                    </nav>
                </div>

                <div className='flex gap-2 items-center'>
                    {isExecuting ? (
                        <Button
                            className="bg-red-400 hover:bg-red-700"
                            onClick={stop_execution}
                        >
                            <Pause /> Stop
                        </Button>
                    ) : (
                        <Button
                            className="bg-green-400 hover:bg-green-700"
                            onClick={start_execution}
                        >
                            <Play /> Execute
                        </Button>
                    )}


                    <Button><FileClock />Schedule</Button>
                </div>
            </header>
            <main className="grid grid-cols-[300px_1fr] gap-2 border rounded not-first-of-type: p-2 min-h-0 h-full">
                <SideBar addNode={addNode} />
                <div className="border rounded m-2 p-2">
                    <ReactFlow

                        nodeTypes={customNodeTypes}
                        // edgeTypes={customEdgeTypes}

                        nodes={nodes}
                        onNodesChange={onNodesChange}

                        onConnect={onConnect}
                        edges={connections}
                        onEdgesChange={onEdgesChange}

                        fitView
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </main>
            <footer className='border rounded p-2'>Footer</footer>

        </section>
    )
}

export default WorkFlowEditor