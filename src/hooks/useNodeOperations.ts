import { useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { backendService } from '@/app/services/backend'
import { FieldValues } from 'react-hook-form'
import { showErrorToast, showSuccessToast, withErrorHandling } from '@/lib/errorHandler'

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
    try {
      const isDeleted = await backendService.deleteWorkFlowNode(workflowId, nodeId)
      if (isDeleted) {
        setNodes((nodesSnapshot) => nodesSnapshot.filter(node => node.id !== nodeId))
        showSuccessToast('Node deleted successfully')
      } else {
        showErrorToast({ message: 'Failed to delete node' } as any, 'Delete Failed')
      }
    } catch (error) {
      showErrorToast(error as any, 'Delete Failed')
    }
  }

  const submitNodeData = async (values: FieldValues) => {
    try {
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
          try {
            const uploadResponse = await backendService.uploadWorkFlowNodeFile(workflowId, nodeId, key, file)
            return { key, id: uploadResponse.id }
          } catch (error) {
            showErrorToast(error as any, `File Upload Failed: ${key}`)
            throw error
          }
        })
        
        // Wait for all file uploads to complete
        const fileUploadResults = await Promise.all(fileUploadPromises)
        
        // Replace file field keys with their uploaded IDs in the regular fields
        fileUploadResults.forEach(({ key, id }) => {
          regularFields[key] = id
        })
      }
      
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
      
      showSuccessToast('Node data saved successfully')
    } catch (error) {
      showErrorToast(error as any, 'Save Failed')
      throw error // Re-throw to let the form handle it
    }
  }

  const clearNodeData = async () => {
    try {
      setIsClearing(true)
      
      // First, delete existing files from backend
      const fileFields = nodeTypeConfig.filter(field => field.type === 'file' && nodeConfig[field.key])
      
      if (fileFields.length > 0) {
        const fileDeletePromises = fileFields.map(async (field) => {
          try {
            const fileId = nodeConfig[field.key]
            return await backendService.deleteWorkFlowNodeFile(workflowId, nodeId, fileId)
          } catch (error) {
            showErrorToast(error as any, `File Delete Failed: ${field.key}`)
            throw error
          }
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
      await backendService.patchWorkFlowNodeData(workflowId, nodeId, emptyData)
      
      // Update the node data in React Flow state
      setNodes((nodesSnapshot) => 
        nodesSnapshot.map(node => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, config: emptyData } }
            : node
        )
      )
      
      showSuccessToast('Node data cleared successfully')
      return emptyData
    } catch (error) {
      showErrorToast(error as any, 'Clear Failed')
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
