import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TNode } from "@/types";
import { TFormConfiguration } from "@/types/api/backend";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";
import { useNodeGroups } from "@/hooks/useNodeGroups";

export const useCreateNodePage = () => {
  const router = useRouter();
  
  // Get node groups to set default
  const { nodeGroups } = useNodeGroups();
  
  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<TNode>>({
    defaultValues: {
      name: "",
      type: "action",
      nodeGroup: "", // Will be set when nodeGroups are loaded
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

  const handleFormConfigurationChange = useCallback((json: TFormConfiguration) => {
    // Only update if the JSON is actually different to prevent unnecessary re-renders
    if (JSON.stringify(formData.form_configuration) !== JSON.stringify(json)) {
      setValue("form_configuration", json);
    }
  }, [formData.form_configuration, setValue]);

  // Set active page on mount
  useEffect(() => {
    setActivePage("Create Node");
  }, [setActivePage]);

  // Set default nodeGroup when nodeGroups are loaded
  useEffect(() => {
    if (nodeGroups.length > 0 && !formData.node_group) {
      console.log('Setting default nodeGroup to:', nodeGroups[0].id);
      setValue('node_group', nodeGroups[0].id);
    }
  }, [nodeGroups, setValue, formData.node_group]);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('Form data changed:', formData);
  }, [formData]);

  const onSubmit = async (data: Partial<TNode>) => {
    try {
      // Ensure we have a valid nodeGroup
      const selectedNodeGroup = data.node_group || (nodeGroups.length > 0 ? nodeGroups[0].id : '');
      
      if (!selectedNodeGroup) {
        console.error('No nodeGroup selected and no default available');
        uiHelpers.showError('Validation Error', 'Please select a node group');
        return;
      }

      // Prepare the node data for creation
      const nodeData = {
        name: data.name || '',
        type: data.type || 'action',
        node_group: selectedNodeGroup,
        description: data.description || '',
        version: data.version || '1.0.0',
        is_active: data.is_active !== undefined ? data.is_active : true,
        form_configuration: data.form_configuration || {},
        tags: data.tags || [],
        logo: logoFile || undefined, // Include the logo file
      };

      // Debug: Log the data being sent
      console.log('Creating node with data:', nodeData);
      console.log('Available nodeGroups:', nodeGroups);

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
