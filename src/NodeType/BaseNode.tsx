import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GripVertical, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { backendService } from '@/app/services/backend'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TBaseNodeProps } from '@/types/nodeConnection'


const BaseNode = (props: TBaseNodeProps) => {
    const { setNodes } = useReactFlow();
    const workFlow_id = useSelector((state: RootState) => state.WorkFlow.id);

    const onDelete = async (workflow_id: string, node_id: string) => {
        const isDeleted = await backendService.deleteWorkFlowNode(workflow_id, node_id);
        if (isDeleted) {
            setNodes((nodesSnapshot) => nodesSnapshot.filter(node => node.id !== node_id))
        }
    }

    return (
        <section
            className={
                cn("border rounded p-1 bg-white flex flex-col gap-2 min-w-[300px]",
                    props.selected && "border-gray-900")}
        >
            <header className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={props.data?.node_type?.logo} />
                        <AvatarFallback className='bg-red-400 '>{props.data.node_type.name.split('').slice(0, 2).join('').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className='font-bold text-gray-800'>{props.data.node_type.name}</h1>
                </div>
                <div className='flex items-center'>
                    <Trash
                        onClick={() => onDelete(workFlow_id, props.id)}
                        className='text-red-200 hover:text-red-600 hover:cursor-pointer w-5' />
                    <div className='dragByVerticalGrip'>
                        <GripVertical />
                    </div>
                </div>
            </header>
            <main className='border rounded p-2'>
                Body Of Node
            </main>
            <footer className='text-xs text-gray-500'>Id: {props.id}</footer>
            {
                props.data.node_type.input &&
                <Handle
                    type="target"
                    position={Position.Left}
                    style={{ background: 'green', width: 12, height: 12 }}
                />
            }
            {
                props.data.node_type.output &&
                <Handle
                    type="source"
                    position={Position.Right}
                    style={{ background: 'orange', width: 12, height: 12 }}
                />
            }

        </section>
    )
}

export default BaseNode