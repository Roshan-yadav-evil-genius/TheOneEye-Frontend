import React from 'react'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TBaseNodeProps } from '@/types/nodeConnection'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { 
  NodeHeader, 
  FormFieldRenderer, 
  FormActions, 
  NodeHandles 
} from '@/components/nodes'
import { useNodeOperations } from '@/hooks/useNodeOperations'


const BaseNode = (props: TBaseNodeProps) => {
  const workFlow_id = useSelector((state: RootState) => state.WorkFlow.id);

  // Initialize form with default values
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

  // Use custom hook for node operations
  const { deleteNode, submitNodeData, clearNodeData, isClearing } = useNodeOperations({
    workflowId: workFlow_id,
    nodeId: props.id,
    nodeConfig: props.data.config,
    nodeTypeConfig: props.data.node_type.config
  })

  const onSubmit = async (values: any) => {
    await submitNodeData(values);
  }

  const handleClear = async () => {
    const emptyData = await clearNodeData();
    form.reset(emptyData);
  }
  
  return (
    <section
      className={
        cn("border rounded p-1 bg-white flex flex-col gap-2 min-w-[300px]",
          props.selected && "border-gray-900")}
    >
      <NodeHeader
        nodeType={props.data.node_type}
        selected={props.selected}
        onDelete={deleteNode}
      />
      
      <main className='border rounded p-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {props.data.node_type.config.map((node_field) => (
              <FormFieldRenderer
                key={node_field.key}
                field={node_field}
                control={form.control}
                name={node_field.key}
                existingValue={props.data.config[node_field.key]}
                className='mb-2'
              />
            ))}
            
            <FormActions
              isSubmitting={form.formState.isSubmitting}
              isClearing={isClearing}
              onClear={handleClear}
              onSave={form.handleSubmit(onSubmit)}
              hasFields={props.data.node_type.config.length > 0}
              className='flex justify-end gap-5'
            />
          </form>
        </Form>
      </main>
      
      <footer className='text-xs text-gray-500'>Id: {props.id}</footer>
      
      <NodeHandles
        hasInput={props.data.node_type.input}
        hasOutput={props.data.node_type.output}
      />
    </section>
  )
}

export default BaseNode