import { useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { backendService } from '@/app/services/backend'
import { FieldValues } from 'react-hook-form'
import { showToast, withErrorHandling } from '@/lib/errorHandler'

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
    if (isDeleted === true) {
      setNodes((nodesSnapshot) => nodesSnapshot.filter(node => node.id !== nodeId))
      showToast('Node deleted successfully')
    }
    // Error handling is now done in the backend service
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
    if (Object.keys(fileFields).length > 0) {
      const fileUploadPromises = Object.entries(fileFields).map(async ([key, file]) => {
        const uploadResponse = await backendService.uploadWorkFlowNodeFile(workflowId, nodeId, key, file)
        if (uploadResponse) {
          return { key, id: uploadResponse.id }
        }
        throw new Error(`File upload failed for ${key}`)
      })
      
      // Wait for all file uploads to complete
      const fileUploadResults = await Promise.all(fileUploadPromises)
      
      // Replace file field keys with their uploaded IDs in the regular fields
      fileUploadResults.forEach(({ key, id }) => {
        regularFields[key] = id
      })
    }
    
    // Submit the final data (regular fields + file IDs)
    const result = await backendService.patchWorkFlowNodeData(workflowId, nodeId, regularFields)
    
    if (result) {
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
      
      showToast('Node data saved successfully')
    }
    // Error handling is now done in the backend service
  }

  const clearNodeData = async () => {
    try {
      setIsClearing(true)
      
      // First, delete existing files from backend
      const fileFields = nodeTypeConfig.filter(field => field.type === 'file' && nodeConfig[field.key])
      
      if (fileFields.length > 0) {
        const fileDeletePromises = fileFields.map(async (field) => {
          const fileId = nodeConfig[field.key]
          return await backendService.deleteWorkFlowNodeFile(workflowId, nodeId, fileId)
        })
        
        // Wait for all file deletions to complete
        await Promise.all(fileDeletePromises)
      }
      
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
      const result = await backendService.patchWorkFlowNodeData(workflowId, nodeId, emptyData)
      
      if (result) {
        // Update the node data in React Flow state
        setNodes((nodesSnapshot) => 
          nodesSnapshot.map(node => 
            node.id === nodeId 
              ? { ...node, data: { ...node.data, config: emptyData } }
              : node
          )
        )
        
        showToast('Node data cleared successfully')
        return emptyData
      }
    } catch (error) {
      // This catch block is for any non-API errors
      showToast('Clear operation failed')
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
