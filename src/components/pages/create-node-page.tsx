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
    console.log('Form configuration changed:', json);
    // Only update if the JSON is actually different to prevent unnecessary re-renders
    if (JSON.stringify(formData.formConfiguration) !== JSON.stringify(json)) {
      setValue("formConfiguration", json);
      console.log('Form configuration updated in form state');
    }
  }, [formData.formConfiguration, setValue]);

  // Set active page on mount
  useEffect(() => {
    setActivePage("Create Node");
  }, [setActivePage]);

  const onSubmit = async (data: Partial<Node>) => {
    console.log('Form submitted with data:', data);
    console.log('Form configuration in submitted data:', data.formConfiguration);
    try {
      // Prepare the node data for creation
      const nodeData = {
        name: data.name || '',
        type: data.type || 'action',
        category: data.category || 'system',
        description: data.description || '',
        version: data.version || '1.0.0',
        isActive: data.isActive !== undefined ? data.isActive : true,
        formConfiguration: data.formConfiguration || {},
        tags: data.tags || [],
      };

      console.log('Prepared node data:', nodeData);
      console.log('Form configuration being sent to API:', nodeData.formConfiguration);

      // Create the node using the store
      await createNode(nodeData);
      
      // Navigate back to nodes list on success
      router.push('/nodes');
    } catch (error) {
      console.error('Error creating node:', error);
      // Error handling is done in the store
    }
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

              {/* Form Configuration Component */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Form Configuration</label>
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
                onSave={() => {}} // This will be handled by form submission
                formData={formData}
              />
            </form>
          </CardContent>
        </Card>
      </div>

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
