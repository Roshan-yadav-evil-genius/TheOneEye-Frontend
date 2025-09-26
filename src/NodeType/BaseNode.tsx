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

  const form = useForm({
    defaultValues: props.data.node_type.config.reduce((acc, field) => {
      acc[field.key] =  ""; // fallback to empty string
      return acc;
    }, {} as Record<string, any>)
  })
  const onSubmit = (values: FieldValues) => {
    console.log(values)
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
            <AvatarFallback className='bg-red-400 '>{props.data.node_type.name.split('').slice(0, 2).join('').toUpperCase()}</AvatarFallback>
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
                console.log(node_field)
                return (
                  <FormField
                    key={node_field.key}
                    control={form.control}
                    name={node_field.key}
                    render={({ field }) => (
                      <FormItem className='mb-2'>
                        <FormLabel>{node_field.label}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={node_field.type}
                            required={node_field.required}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              })
            }
          </form>
        </Form>
        <div className='flex justify-end'>

          {props.data.node_type.config.length > 0 && (
            <Button size="sm" type="submit"
            >
              {form.formState.isSubmitting && <Loader2Icon className="animate-spin" />}
              Save
            </Button>
          )}
        </div>
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