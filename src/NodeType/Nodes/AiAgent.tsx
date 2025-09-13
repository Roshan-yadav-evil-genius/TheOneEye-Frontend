import React, { useState } from 'react'
import BaseNode from '../BaseNode'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { getNodeAvatar } from '../Mappings'
import { ENodeTypes } from '../NodeTypes'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { backendService } from '@/app/services/backend'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TAiAgentProps } from '@/types/nodeConnection'

const AiAgent = (props: TAiAgentProps) => {
    const [systemPrompt, setSystemPrompt] = useState(props.data.system_prompt??"")
    const workflow_id = useSelector((store: RootState) => store.WorkFlow.id)

    const saveData = async () => {
        if (systemPrompt) {
            await backendService.patchWorkFlowNodeData(workflow_id, props.id, { system_prompt: systemPrompt })
        }
    }

    return (
        <BaseNode node_id={props.id} title='Ai Agent' avatar={getNodeAvatar(ENodeTypes.AiAgent)} selected={props.selected}>
            <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="You are an helpfull ai assistant"
                    className='h-20 w-[300px]'
                    onBlur={saveData}
                     />
            </div>
            <Handle type="target" position={Position.Left} style={{ width: 10, height: 10 }} />
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default AiAgent