import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GripVertical, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NodeHeaderProps {
  nodeType: {
    name: string
    logo?: string
  }
  selected?: boolean
  onDelete: () => void
  className?: string
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({
  nodeType,
  selected = false,
  onDelete,
  className
}) => {
  return (
    <header className={cn('flex justify-between items-center', className)}>
      <div className='flex items-center gap-2'>
        <Avatar>
          <AvatarImage src={nodeType.logo} />
          <AvatarFallback className='bg-red-400'>
            {nodeType.name.split('').slice(0, 2).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className='font-bold text-gray-800'>{nodeType.name}</h1>
      </div>
      <div className='flex items-center'>
        <Trash
          onClick={onDelete}
          className='text-red-200 hover:text-red-600 hover:cursor-pointer w-5' 
        />
        <div className='dragByVerticalGrip'>
          <GripVertical />
        </div>
      </div>
    </header>
  )
}
