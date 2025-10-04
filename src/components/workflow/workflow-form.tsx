"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const WORKFLOW_CATEGORIES = [
  "Marketing",
  "Infrastructure", 
  "Support",
  "Finance",
  "Security",
  "Monitoring",
  "Analytics",
  "Operations",
  "Sales",
  "Content",
  "Testing",
  "Other"
];

export interface WorkflowFormData {
  name: string;
  description: string;
  category: string;
}

export interface WorkflowFormProps {
  initialData?: Partial<WorkflowFormData>;
  onSubmit: (data: WorkflowFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
}

export function WorkflowForm({
  initialData = {},
  onSubmit,
  submitButtonText,
  onCancel,
}: WorkflowFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<WorkflowFormData>({
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      category: initialData.category || "",
    },
    mode: "onChange",
  });

  const categoryValue = watch("category");

  // Update form when initialData changes
  useEffect(() => {
    // Only reset if initialData has actual values to avoid infinite loops
    if (initialData.name || initialData.description || initialData.category) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "",
      });
    }
  }, [initialData.name, initialData.description, initialData.category, reset]);

  const onFormSubmit = async (data: WorkflowFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Enter workflow name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters"
            }
          })}
          className={errors.name ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe what this workflow does"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters"
            }
          })}
          className={errors.description ? "border-red-500" : ""}
          rows={3}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        {/* Hidden input for React Hook Form validation */}
        <input
          type="hidden"
          {...register("category", { required: "Category is required" })}
        />
        <Select
          value={categoryValue}
          onValueChange={(value) => setValue("category", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={`w-full ${errors.category ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {WORKFLOW_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
