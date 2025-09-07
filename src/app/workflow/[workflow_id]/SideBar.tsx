import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { backendService } from '@/app/services/backend'
import { TNodeType } from '@/types/backendService'
import { nodeTypesValueToEnum } from '@/NodeType/constants'
import { ENodeTypes } from '@/types/nodeConnection'

type SideBarProps = {
  addNode: (nodeType:ENodeTypes) => void
}

const SideBar = (props: SideBarProps) => {
  const [nodeTypes, setNodes] = useState<TNodeType[]>([])

  useEffect(() => {
    const loadNodeTypes = async () => {
      const _nodes = await backendService.getWorkFlowNodeTypes()
      setNodes(_nodes)
    }
    loadNodeTypes()
  }, [])
  return (
    <div className="border rounded m-2 p-2 gap-2 flex flex-col">
      <h1 className='text-xl font-bold text-gray-700'>Nodes</h1>
      <ul className='border rounded'>
        {
          nodeTypes.map((nodeType) => {
            return <li
              key={nodeType.id}
              onClick={()=>props.addNode(nodeTypesValueToEnum(nodeType.id))}
              className="border rounded m-2 p-2 active:bg-gray-400 hover:bg-gray-200"
            >{nodeType.name}</li>
          })
        }
      </ul>
    </div>
  )
}

export default SideBar