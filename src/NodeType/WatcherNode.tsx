import { Handle, NodeProps, Position } from '@xyflow/react'
import React from 'react'
import BaseNode from './BaseNode'

const WatcherNode = (props: NodeProps) => {

    return (
        <BaseNode id={props.id} title='Freelance Watcher' selected={props.selected}>
            WatcherNode
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default WatcherNode