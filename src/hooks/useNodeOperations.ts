import { useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { backendService } from '@/app/services/backend'
import { FieldValues } from 'react-hook-form'

interface NodeConfig {
  [key: string]: any
}

interface NodeTypeConfig {
  key: string
  label: string
  type: string
  required?: boolean
}

interface UseNodeOperationsProps {
  workflowId: string
  nodeId: string
  nodeConfig: NodeConfig
  nodeTypeConfig: NodeTypeConfig[]
}

export const useNodeOperations = ({
  workflowId,
  nodeId,
  nodeConfig,
  nodeTypeConfig
}: UseNodeOperationsProps) => {
  const { setNodes } = useReactFlow()
  const [isClearing, setIsClearing] = useState(false)

  const deleteNode = async () => {
    const isDeleted = await backendService.deleteWorkFlowNode(workflowId, nodeId)
    if (isDeleted) {
      setNodes((nodesSnapshot) => nodesSnapshot.filter(node => node.id !== nodeId))
    }
  }

  const submitNodeData = async (values: FieldValues) => {
    console.log('Form submitted for node:', nodeId, 'with values:', values)
    
    // Separate file fields from regular fields
    const fileFields: { [key: string]: File } = {}
    const regularFields: { [key: string]: any } = {}
    
    // Process each field based on its type
    nodeTypeConfig.forEach(field => {
      const value = values[field.key]
      if (field.type === 'file') {
        if (value && value instanceof FileList && value.length > 0) {
          // New file selected - upload it
          fileFields[field.key] = value[0] // Take the first file
        } else if (nodeConfig[field.key]) {
          // No new file selected but existing file exists - keep the existing ID
          regularFields[field.key] = nodeConfig[field.key]
        }
      } else {
        regularFields[field.key] = value
      }
    })
    
    // Upload files first and collect their IDs
    const fileUploadPromises = Object.entries(fileFields).map(async ([key, file]) => {
      const uploadResponse = await backendService.uploadWorkFlowNodeFile(workflowId, nodeId, key, file)
      return { key, id: uploadResponse.id }
    })
    
    // Wait for all file uploads to complete
    const fileUploadResults = await Promise.all(fileUploadPromises)
    
    // Replace file field keys with their uploaded IDs in the regular fields
    fileUploadResults.forEach(({ key, id }) => {
      regularFields[key] = id
    })
    
    // Submit the final data (regular fields + file IDs)
    await backendService.patchWorkFlowNodeData(workflowId, nodeId, regularFields)
    
    // Update the node data in React Flow state to reflect the new file IDs
    setNodes((nodesSnapshot) => 
      nodesSnapshot.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                config: { 
                  ...(node.data.config || {}), 
                  ...regularFields 
                } 
              } 
            }
          : node
      )
    )
  }

  const clearNodeData = async () => {
    try {
      setIsClearing(true)
      
      // First, delete existing files from backend
      const fileDeletePromises = nodeTypeConfig
        .filter(field => field.type === 'file' && nodeConfig[field.key])
        .map(async (field) => {
          const fileId = nodeConfig[field.key]
          return backendService.deleteWorkFlowNodeFile(workflowId, nodeId, fileId)
        })
      
      // Wait for all file deletions to complete
      await Promise.all(fileDeletePromises)
      
      // Clear all data in backend
      const emptyData = nodeTypeConfig.reduce((acc, field) => {
        if (field.type === 'file') {
          acc[field.key] = null
        } else {
          acc[field.key] = ""
        }
        return acc
      }, {} as Record<string, any>)
      
      // Update backend with empty data
      await backendService.patchWorkFlowNodeData(workflowId, nodeId, emptyData)
      
      // Update the node data in React Flow state
      setNodes((nodesSnapshot) => 
        nodesSnapshot.map(node => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, config: emptyData } }
            : node
        )
      )
      
      return emptyData
    } catch (error) {
      console.error('Error clearing node data:', error)
      throw error
    } finally {
      setIsClearing(false)
    }
  }

  return {
    deleteNode,
    submitNodeData,
    clearNodeData,
    isClearing
  }
}
