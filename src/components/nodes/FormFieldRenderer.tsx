import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FileField } from './FileField'

interface SelectOption {
  label: string
  value: string
}

interface FieldConfig {
  key: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  value?: any
  options?: SelectOption[]
}

interface FormFieldRendererProps<T extends FieldValues> {
  field: FieldConfig
  control: Control<T>
  name: Path<T>
  existingValue?: any
  className?: string
}

export const FormFieldRenderer = <T extends FieldValues>({
  field,
  control,
  name,
  existingValue,
  className
}: FormFieldRendererProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: formField }) => (
        <FormItem className={className}>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            {field.type === 'file' ? (
              <FileField
                value={formField.value}
                onChange={formField.onChange}
                required={field.required}
                existingFileId={existingValue}
                className="space-y-2"
              />
            ) : field.type === 'select' ? (
              <Select onValueChange={formField.onChange} value={formField.value || existingValue}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'textarea' ? (
              <Textarea
                {...formField}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
              />
            ) : (
              <Input
                {...formField}
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
