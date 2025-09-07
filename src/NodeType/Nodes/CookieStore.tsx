import { Handle, NodeProps, Position } from '@xyflow/react'
import React, { useEffect, useState } from 'react'
import BaseNode from '../BaseNode'
import { Textarea } from "@/components/ui/textarea"
import { isJsonString } from '@/lib/utils'
import { backendService } from '@/app/services/backend'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TCookieStoreProps } from '@/types/nodeConnection'
import { ENodeTypes } from '@/constants/NodeTypes'
import { getNodeAvatar } from '../Mappings'

const CookieStore = (props: TCookieStoreProps) => {
    const workflow_id = useSelector((store: RootState) => store.WorkFlow.id)
    const [cookies, setCookies] = useState(props.data.cookies ?? "")

    const saveData = async (data: Record<string, any>) => {
        const updatedNode = await backendService.patchWorkFlowNodeData(workflow_id, props.id, data)
        console.log(updatedNode)
        setCookies(updatedNode.data.cookies)
    }

    const saveIfValid = (cookies: string) => {
        if (isJsonString(cookies)) {
            saveData({ cookies: cookies })
        } else {
            console.log(false)
        }
    }


    return (
        <BaseNode node_id={props.id} avatar={getNodeAvatar(ENodeTypes.CookieStore)} title='CookieStore' selected={props.selected}>
            <Textarea value={cookies} onChange={(e) => setCookies(e.target.value)} placeholder="Paste Platform Cookies." className='h-40 w-[300px]' onBlur={(e) => saveIfValid(e.target.value)} />
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default CookieStore