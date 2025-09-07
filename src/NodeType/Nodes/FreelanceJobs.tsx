import { Handle, NodeProps, Position } from '@xyflow/react'
import React, { useEffect, useRef, useState } from 'react'
import BaseNode from '../BaseNode'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { backendService } from '@/app/services/backend'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TFreelanceJobsProps } from '@/types/nodeConnection'
import { getNodeAvatar } from '../Mappings'
import { ENodeTypes } from '@/constants/NodeTypes'

const FreelanceJobs = (props: TFreelanceJobsProps) => {
    const workflow_id = useSelector((store: RootState) => store.WorkFlow.id)
    console.log(props.data)
    const [projectPageUrl, setProjectPageUrl] = useState(props.data.projectPageUrl ?? "")
    const [executionMode, setExecutionMode] = useState(props.data.executionMode ?? "1")

    const saveData = async (data: Record<string, any>) => {
        const updatedNode = await backendService.patchWorkFlowNodeData(workflow_id, props.id, data)
        console.log(updatedNode)
    }

    const saveIfValid = () => {
        if (projectPageUrl && executionMode) {
            const newData = {
                "projectPageUrl": projectPageUrl,
                "executionMode": executionMode,
            }
            saveData(newData)
        }
    }

    const onExecutionModeChange = (value: string) => {
        setExecutionMode(value)
        saveIfValid()
    }



    return (
        <BaseNode node_id={props.id} title='Freelance Jobs' avatar={getNodeAvatar(ENodeTypes.FreelanceJobs)} selected={props.selected}>
            <div className='grid w-full max-w-sm items-center gap-5'>

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="projectPageUrl">Project Page Url</Label>
                    <Input
                        id="projectPageUrl"
                        onBlur={saveIfValid}
                        value={projectPageUrl}
                        onChange={(e) => setProjectPageUrl(e.target.value)}
                        type='url'
                        placeholder='https://www.freelancer.in/search/projects' />
                </div>
                <div className='grid w-full max-w-sm items-center gap-3'>
                    <Label htmlFor="execution_mode">Execution Mode</Label>

                    <Select value={executionMode} onValueChange={onExecutionModeChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Execution Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">One-time</SelectItem>
                            <SelectItem value="2">Continuous</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
            <Handle type="target" position={Position.Left} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default FreelanceJobs