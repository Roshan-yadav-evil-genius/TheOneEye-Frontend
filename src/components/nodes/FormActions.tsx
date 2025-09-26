import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'

interface FormActionsProps {
  isSubmitting: boolean
  isClearing: boolean
  onClear: () => void
  onSave: () => void
  hasFields: boolean
  className?: string
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  isClearing,
  onClear,
  onSave,
  hasFields,
  className
}) => {
  if (!hasFields) return null

  return (
    <div className={className}>
      <Button 
        size="sm" 
        className='hover:bg-red-600'
        type="button"
        onClick={onClear}
        disabled={isSubmitting || isClearing}
      >
        {(isSubmitting || isClearing) && <Loader2Icon className="animate-spin" />}
        Clear
      </Button>
      <Button 
        size="sm" 
        type="submit"
        disabled={isSubmitting || isClearing}
      >
        {isSubmitting && <Loader2Icon className="animate-spin" />}
        Save
      </Button>
    </div>
  )
}
