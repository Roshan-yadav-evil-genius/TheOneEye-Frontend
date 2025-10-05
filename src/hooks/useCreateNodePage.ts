import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TNode } from "@/types";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";

export const useCreateNodePage = () => {
  const router = useRouter();
  
  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<TNode>>({
    defaultValues: {
      name: "",
      type: "action",
      nodeGroup: "",
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
  const { isLoading: isCreatingForm } = useFormStore();
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

  const onSubmit = async (data: Partial<TNode>) => {
    try {
      // Prepare the node data for creation
      const nodeData = {
        name: data.name || '',
        type: data.type || 'action',
        nodeGroup: data.nodeGroup || '',
        description: data.description || '',
        version: data.version || '1.0.0',
        isActive: data.isActive !== undefined ? data.isActive : true,
        formConfiguration: data.formConfiguration || {},
        tags: data.tags || [],
        logoFile: logoFile || undefined, // Include the logo file
      };

      // Create the node using the store
      await createNode(nodeData);
      
      // Navigate back to nodes list on success
      router.push('/nodes');
    } catch (error) {
      console.error('Error creating node:', error);
      // Error handling is done in the store
    }
  };

  const onError = (errors: Record<string, unknown>) => {
    console.log("Form validation errors:", errors);
    uiHelpers.showError("Validation Error", "Please check the form for errors");
  };

  const isCreating = isCreatingNode || isCreatingForm;

  return {
    // Form state
    control,
    formData,
    errors,
    logoFile,
    logoPreview,
    isPreviewOpen,
    isCreating,
    
    // Actions
    handleSubmit,
    handleVersionChange,
    handleTagsChange,
    handleLogoChange,
    handleFormConfigurationChange,
    onSubmit,
    onError,
    setIsPreviewOpen,
  };
};
