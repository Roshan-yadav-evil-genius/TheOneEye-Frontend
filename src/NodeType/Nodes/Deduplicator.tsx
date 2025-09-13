import { Handle, NodeProps, Position } from '@xyflow/react'
import React, { useEffect, useState } from 'react'
import BaseNode from '../BaseNode'
import { Textarea } from "@/components/ui/textarea"
import { isJsonString } from '@/lib/utils'
import { backendService } from '@/app/services/backend'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TDeduplicatorProps as TDeduplicatorProps } from '@/types/nodeConnection'
import { ENodeTypes } from '@/NodeType/NodeTypes'
import { getNodeAvatar } from '../Mappings'

const Deduplicator = (props: TDeduplicatorProps) => {
    const workflow_id = useSelector((store: RootState) => store.WorkFlow.id)

    const saveData = async (data: Record<string, any>) => {
        const updatedNode = await backendService.patchWorkFlowNodeData(workflow_id, props.id, data)
        console.log(updatedNode)
    }




    return (
        <BaseNode node_id={props.id} title='Deduplicator' selected={props.selected}>
            <div className='flex justify-center'>
                <img src={getNodeAvatar(ENodeTypes.Deduplicator)} alt=""  className='h-20' />
            </div>
            <Handle type="target" position={Position.Left} style={{ width: 10, height: 10 }} />
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default Deduplicator