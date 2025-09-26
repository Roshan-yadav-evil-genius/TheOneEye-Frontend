import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GripVertical, Loader2Icon, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { backendService } from '@/app/services/backend'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TBaseNodeProps } from '@/types/nodeConnection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FieldValues, useForm } from 'react-hook-form'


const BaseNode = (props: TBaseNodeProps) => {
  const { setNodes } = useReactFlow();
  const workFlow_id = useSelector((state: RootState) => state.WorkFlow.id);

  const onDelete = async (workflow_id: string, node_id: string) => {
    const isDeleted = await backendService.deleteWorkFlowNode(workflow_id, node_id);
    if (isDeleted) {
      setNodes((nodesSnapshot) => nodesSnapshot.filter(node => node.id !== node_id))
    }
  }

  const [isClearing, setIsClearing] = React.useState(false);

  const form = useForm({
    defaultValues: props.data.node_type.config.reduce((acc, field) => {
      if (field.type === 'file') {
        // For file fields, don't set a default value - let the UI handle showing existing files
        acc[field.key] = null;
      } else {
        acc[field.key] = props.data.config[field.key] || ""; // Use existing data or fallback to empty string
      }
      return acc;
    }, {} as Record<string, any>)
  })

  const onSubmit = async (values: FieldValues) => {
    console.log('Form submitted for node:', props.id, 'with values:', values)
    
    // Separate file fields from regular fields
    const fileFields: { [key: string]: File } = {};
    const regularFields: { [key: string]: any } = {};
    
    // Process each field based on its type
    props.data.node_type.config.forEach(field => {
      const value = values[field.key];
      if (field.type === 'file') {
        if (value && value instanceof FileList && value.length > 0) {
          // New file selected - upload it
          fileFields[field.key] = value[0]; // Take the first file
        } else if (props.data.config[field.key]) {
          // No new file selected but existing file exists - keep the existing ID
          regularFields[field.key] = props.data.config[field.key];
        }
      } else {
        regularFields[field.key] = value;
      }
    });
    
    // Upload files first and collect their IDs
    const fileUploadPromises = Object.entries(fileFields).map(async ([key, file]) => {
      const uploadResponse = await backendService.uploadWorkFlowNodeFile(workFlow_id, props.id, key, file);
      return { key, id: uploadResponse.id };
    });
    
    // Wait for all file uploads to complete
    const fileUploadResults = await Promise.all(fileUploadPromises);
    
    // Replace file field keys with their uploaded IDs in the regular fields
    fileUploadResults.forEach(({ key, id }) => {
      regularFields[key] = id;
    });
    
    // Submit the final data (regular fields + file IDs)
    await backendService.patchWorkFlowNodeData(workFlow_id, props.id, regularFields);
  }
  
  return (
    <section
      className={
        cn("border rounded p-1 bg-white flex flex-col gap-2 min-w-[300px]",
          props.selected && "border-gray-900")}
    >
      <header className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={props.data?.node_type?.logo} />
            <AvatarFallback className='bg-red-400'>{props.data.node_type.name.split('').slice(0, 2).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className='font-bold text-gray-800'>{props.data.node_type.name}</h1>
        </div>
        <div className='flex items-center'>
          <Trash
            onClick={() => onDelete(workFlow_id, props.id)}
            className='text-red-200 hover:text-red-600 hover:cursor-pointer w-5' />
          <div className='dragByVerticalGrip'>
            <GripVertical />
          </div>
        </div>
      </header>
      <main className='border rounded p-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {
              props.data.node_type.config.map((node_field) => {
                return (
                  <FormField
                    key={node_field.key}
                    control={form.control}
                    name={node_field.key}
                    render={({ field }) => (
                      <FormItem className='mb-2'>
                        <FormLabel>{node_field.label}</FormLabel>
                        <FormControl>
                          {node_field.type === 'file' ? (
                            <div className="space-y-2">
                              {/* Show existing file if present */}
                              {props.data.config[node_field.key] && (
                                <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                                  <div className="flex items-center justify-between">
                                    <span className="text-green-700">
                                      📁 (File: {props.data.config[node_field.key]})
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              {/* File input */}
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const fileList = e.target.files;
                                  field.onChange(fileList);
                                }}
                                required={node_field.required && !props.data.config[node_field.key]}
                              />
                            </div>
                          ) : (
                            <Input
                              {...field}
                              type={node_field.type}
                              required={node_field.required}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              })
            }
            {props.data.node_type.config.length > 0 && (
              <div className='flex justify-end gap-5'>
                <Button 
                  size="sm" 
                  className='hover:bg-red-600'
                  type="button"
                  onClick={async () => {
                    try {
                      setIsClearing(true);
                      
                      // First, delete existing files from backend
                      const fileDeletePromises = props.data.node_type.config
                        .filter(field => field.type === 'file' && props.data.config[field.key])
                        .map(async (field) => {
                          const fileId = props.data.config[field.key];
                          return backendService.deleteWorkFlowNodeFile(workFlow_id, props.id, fileId);
                        });
                      
                      // Wait for all file deletions to complete
                      await Promise.all(fileDeletePromises);
                      
                      // Clear all data in backend
                      const emptyData = props.data.node_type.config.reduce((acc, field) => {
                        if (field.type === 'file') {
                          acc[field.key] = null;
                        } else {
                          acc[field.key] = "";
                        }
                        return acc;
                      }, {} as Record<string, any>);
                      
                      // Update backend with empty data
                      await backendService.patchWorkFlowNodeData(workFlow_id, props.id, emptyData);
                      
                      // Update the node data in React Flow state
                      setNodes((nodesSnapshot) => 
                        nodesSnapshot.map(node => 
                          node.id === props.id 
                            ? { ...node, data: { ...node.data, config: emptyData } }
                            : node
                        )
                      );
                      
                      // Reset form to empty values
                      form.reset(emptyData);
                    } catch (error) {
                      console.error('Error clearing node data:', error);
                    } finally {
                      setIsClearing(false);
                    }
                  }}
                >
                  {(form.formState.isSubmitting || isClearing) && <Loader2Icon className="animate-spin" />}
                  Clear
                </Button>
                <Button size="sm" type="submit">
                  {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      </main>
      <footer className='text-xs text-gray-500'>Id: {props.id}</footer>
      {
        props.data.node_type.input &&
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: 'green', width: 12, height: 12 }}
        />
      }
      {
        props.data.node_type.output &&
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'orange', width: 12, height: 12 }}
        />
      }

    </section>
  )
}

export default BaseNode