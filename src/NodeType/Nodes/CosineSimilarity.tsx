import { Handle, NodeProps, Position } from '@xyflow/react'
import React, { useState } from 'react'
import BaseNode from '../BaseNode'
import { Textarea } from '@/components/ui/textarea'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { backendService } from '@/app/services/backend'
import { TCosineSimilarityProps } from '@/types/nodeConnection'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { getNodeAvatar } from '../Mappings'
import { ENodeTypes } from '@/constants/NodeTypes'

const CosineSimilarity = (props: TCosineSimilarityProps) => {
    const workflow_id = useSelector((store: RootState) => store.WorkFlow.id)
    const [cosineInput1, setCosineInput1] = useState(props.data.input ?? "")
    const [threshold, setThreshold] = useState(props.data.threshold ?? 0.5)

    const saveData = async () => {
        if (cosineInput1 && threshold) {
            await backendService.patchWorkFlowNodeData(workflow_id, props.id, { input: cosineInput1, threshold: threshold })
        }
    }


    return (
        <BaseNode node_id={props.id} title='Cosine Similarity' avatar={getNodeAvatar(ENodeTypes.CosineSimilarity)} selected={props.selected}>
            <div className='grid w-full max-w-sm items-center gap-5'>

                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="cosineInput1">Content for similarity calculation.</Label>
                    <Textarea
                        id="cosineInput1"
                        value={cosineInput1}
                        onChange={(e) => setCosineInput1(e.target.value)}
                        placeholder="I Love to Eat Appels"
                        className='h-20 w-[300px]'
                        onBlur={saveData} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="threshold">Threshold</Label>
                    <Input
                        id="threshold"
                        onBlur={saveData}
                        value={threshold}
                        onChange={(e) => setThreshold(parseFloat(e.target.value))}
                        type='number'
                        min={0}
                        step={0.1}
                        max={1}
                        placeholder='https://www.freelancer.in/search/projects' />
                </div>
            </div>
            <Handle type="target" position={Position.Left} style={{ width: 10, height: 10 }} />
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default CosineSimilarity