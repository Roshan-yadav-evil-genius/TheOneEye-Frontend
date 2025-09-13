import React from 'react'
import BaseNode from '../BaseNode'
import { Handle, NodeProps, Position } from '@xyflow/react'
import { ENodeTypes } from '../NodeTypes'
import { getNodeAvatar } from '../Mappings'

const FiniteBrowserOperation = (props: NodeProps) => {
  return (
    <BaseNode  node_id={props.id} title='Finite Browser Operation' avatar={getNodeAvatar(ENodeTypes.FiniteBrowserOperation)} selected={props.selected}>
    <div>FiniteBrowserOperation</div>
    <Handle type="target" position={Position.Left} style={{ width: 10, height: 10 }} />
    </BaseNode>
  )
}

export default FiniteBrowserOperation