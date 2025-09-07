import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EllipsisVertical, GripVertical, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react'
import { backendService } from '@/app/services/backend'

type BaseNodeProps = React.HTMLAttributes<HTMLElement> & {
    node_id: string
    title: string,
    avatar?: string,
    selected?: boolean,
    children: React.ReactNode
}

const BaseNode = ({ node_id, title, avatar, children, selected = false, className = '', ...rest }: BaseNodeProps) => {
    const {setNodes}=useReactFlow();

    const onDelete = async (node_id: string) => {

        // if (!workflowId) return;
        // const isDeleted = await backendService.deleteWorkFlowNode(workflowId, node_id);
        // if (isDeleted) {
            setNodes((nodesSnapshot) => nodesSnapshot.filter(node => node.id !== node_id))
        // }
    }

    return (
        <section
            className={
                cn("border rounded p-1 bg-white flex flex-col gap-2 min-w-[300px]",
                    selected && "border-gray-900",
                    className)}
            {...rest}
        >
            <header className='flex justify-between items-center'>
                <div className='flex items-center'>

                    <div className='dragByVerticalGrip'>
                        <GripVertical />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Avatar>
                            <AvatarImage width={50} src={avatar} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className='font-bold text-gray-800'>{title}</h1>
                    </div>
                </div>
                <div>
                    <Trash className='text-red-200 hover:text-red-600 hover:cursor-pointer w-5' onClick={() =>onDelete(node_id)} />
                </div>
            </header>
            <main className='border rounded p-2'>
                {children}
            </main>
            <footer className='text-xs text-gray-500'>Id: {node_id}</footer>
        </section>
    )
}

export default BaseNode