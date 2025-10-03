"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Node } from "@/data/nodes";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";
import { FormConfigurationEditor } from "@/components/common/form-configuration-editor";
import { NodePreview } from "@/components/NodePreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodeForm, TagsInput, LogoUpload, FormActions } from "./create-node";

export function CreateNodePage() {
  const router = useRouter();
  
  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<Node>>({
    defaultValues: {
      name: "",
      type: "action",
      category: "system",
      description: "",
      version: "1.0.0",
      tags: [],
      formConfiguration: {},
    },
  });
  
  // Watch form values for real-time updates
  const formData = watch();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Zustand store hooks
  const { createNode, isLoading: isCreatingNode } = useNodesStore();
  const { createFormConfiguration, isLoading: isCreatingForm } = useFormStore();
  const { setActivePage } = useUIStore();

  const handleVersionChange = (value: string) => {
    // Only allow semantic versioning format (x.y.z where x, y, z are numbers)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (value === "" || versionRegex.test(value)) {
      setValue("version", value);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags);
  };

  const handleLogoChange = (file: File | null, preview: string | null) => {
    setLogoFile(file);
    setLogoPreview(preview);
  };

  const handleFormConfigurationChange = useCallback((json: Record<string, unknown>) => {
    // Only update if the JSON is actually different to prevent unnecessary re-renders
    if (JSON.stringify(formData.formConfiguration) !== JSON.stringify(json)) {
      setValue("formConfiguration", json);
    }
  }, [formData.formConfiguration, setValue]);

  // Set active page on mount
  useEffect(() => {
    setActivePage("Create Node");
  }, [setActivePage]);

  const onSubmit = (data: Partial<Node>) => {
    // Log the form data instead of persisting
    console.log("Form data:", {
      ...data,
      logoFile: logoFile ? {
        name: logoFile.name,
        size: logoFile.size,
        type: logoFile.type
      } : null,
      logoPreview: logoPreview ? "Image preview available" : null
    });
    
    // Show success notification
    uiHelpers.showSuccess("Success!", "Form data logged to console");
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    uiHelpers.showError("Validation Error", "Please check the form for errors");
  };

  const isCreating = isCreatingNode || isCreatingForm;

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Create Node Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
              <NodeForm 
                control={control}
                errors={errors}
                onVersionChange={handleVersionChange}
              />

              {/* Tags and Logo upload in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TagsInput 
                  tags={formData.tags || []}
                  onTagsChange={handleTagsChange}
                />
                <LogoUpload onLogoChange={handleLogoChange} />
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Form Configuration Component */}
        <FormConfigurationEditor
          value={formData.formConfiguration || {}}
          onChange={handleFormConfigurationChange}
          disabled={isCreating}
        />
      </div>

      {/* Action Buttons */}
      <FormActions
        isCreating={isCreating}
        onPreview={() => setIsPreviewOpen(true)}
        onSave={() => {}}
        formData={formData}
      />

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Node Preview</DialogTitle>
          </DialogHeader>
          <NodePreview 
            nodeData={formData} 
            logoPreview={logoPreview}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
