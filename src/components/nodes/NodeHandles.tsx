import React from 'react'
import { Handle, Position } from '@xyflow/react'

interface NodeHandlesProps {
  hasInput?: boolean
  hasOutput?: boolean
}

export const NodeHandles: React.FC<NodeHandlesProps> = ({
  hasInput = false,
  hasOutput = false
}) => {
  return (
    <>
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: 'green', width: 12, height: 12 }}
        />
      )}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'orange', width: 12, height: 12 }}
        />
      )}
    </>
  )
}
