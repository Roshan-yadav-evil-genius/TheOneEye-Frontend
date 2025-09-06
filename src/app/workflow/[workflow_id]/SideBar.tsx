import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { backendService } from '@/app/services/backend'
import { NodeType } from '@/types/backendService'

const SideBar = () => {
  const [nodes, setNodes] = useState<NodeType[]>([])

  useEffect(()=>{
    const loadNodeTypes=async ()=>{
      const _nodes = await backendService.getWorkFlowNodeTypes()
      setNodes(_nodes)
    }
    loadNodeTypes()
  },[])
  return (
    <div className="border rounded m-2 p-2 gap-2 flex flex-col">
      <h1 className='text-xl font-bold text-gray-700'>Nodes</h1>
      <ul className='border rounded'>
      {
          nodes.map((node) => {
            return <li key={node.id} className="border rounded m-2 p-2 active:bg-gray-400 hover:bg-gray-200">{node.name}</li>
          })
        }
      </ul>
    </div>
  )
}

export default SideBar