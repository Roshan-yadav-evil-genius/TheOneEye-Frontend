import { Handle, NodeProps, Position } from '@xyflow/react'
import React from 'react'
import BaseNode from '../BaseNode'

const CookieStore = (props: NodeProps) => {
    return (
        <BaseNode node_id={props.id} title='CookieStore' selected={props.selected}>
            CookieStore
            <Handle type="source" position={Position.Right} style={{ width: 10, height: 10 }} />
        </BaseNode>
    )
}

export default CookieStore