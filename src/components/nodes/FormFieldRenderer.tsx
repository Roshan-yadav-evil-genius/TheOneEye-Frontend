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
            ) : field.type === 'radio' ? (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`${field.key}-${option.value}`}
                      name={field.key}
                      value={option.value}
                      checked={(formField.value || existingValue) === option.value}
                      onChange={(e) => formField.onChange(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`${field.key}-${option.value}`} className="text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={field.key}
                  checked={formField.value || existingValue}
                  onChange={(e) => formField.onChange(e.target.checked)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                  {field.label}
                </label>
              </div>
            ) : field.type === 'range' ? (
              <div className="space-y-2">
                <input
                  type="range"
                  min={field.min || 0}
                  max={field.max || 100}
                  step={field.step || 1}
                  value={formField.value || existingValue || field.min || 0}
                  onChange={(e) => formField.onChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-500 text-center">
                  {formField.value || existingValue || field.min || 0}
                </div>
              </div>
            ) : field.type === 'textarea' ? (
              <Textarea
                {...formField}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
              />
            ) : field.type === 'hidden' ? (
              <input
                type="hidden"
                {...formField}
                value={field.value || formField.value}
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
