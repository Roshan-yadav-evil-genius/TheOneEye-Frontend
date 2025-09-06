import { Handle, NodeProps, Position } from '@xyflow/react'
import React from 'react'
import BaseNode from './BaseNode'

const CosineSimilarityNode = (props: NodeProps) => {
    return (
        <BaseNode id={props.id} title='CosineSimilarityNode' avatar="https://github.com/shadcn.png" selected={props.selected}>
            CosineSimilarityNode
            <Handle type="source" position={Position.Left} style={{ width: 10, height: 10 }} />
            <Handle type="target" position={Position.Right} style={{ width: 10, height: 10 }} />

        </BaseNode>
    )
}

export default CosineSimilarityNode