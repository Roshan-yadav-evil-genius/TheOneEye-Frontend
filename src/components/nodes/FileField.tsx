import React from 'react'
import { Input } from '@/components/ui/input'
import { FormDescription } from '@/components/ui/form'

interface FileFieldProps {
  value: FileList | null
  onChange: (value: FileList | null) => void
  required?: boolean
  existingFileId?: string
  className?: string
}

export const FileField: React.FC<FileFieldProps> = ({
  value,
  onChange,
  required = false,
  existingFileId,
  className
}) => {
  return (
    <div className={className}>
      <Input
        type="file"
        onChange={(e) => onChange(e.target.files)}
        required={required && !existingFileId}
        className={className}
      />
      <FormDescription>
        {existingFileId && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            File: <span className="font-mono">{existingFileId}</span>
          </span>
        )}
      </FormDescription>
    </div>
  )
}
