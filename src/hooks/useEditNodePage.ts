import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { TNode } from "@/types";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";

export const useEditNodePage = () => {
  const router = useRouter();
  const params = useParams();
  const nodeId = params.id as string;
  
  const [formData, setFormData] = useState<Partial<TNode>>({
    name: "",
    type: "action",
    nodeGroup: "",
    description: "",
    version: "1.0.0",
    tags: [],
    formConfiguration: {},
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [currentTagInput, setCurrentTagInput] = useState<string>("");
  const [isLoadingNode, setIsLoadingNode] = useState(true);
  const [nodeLoadError, setNodeLoadError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Zustand store hooks
  const { 
    nodes, 
    updateNode,
    getNode,
    loadNodes,
    isLoading: isUpdatingNode
  } = useNodesStore();
  const { createFormConfiguration, isLoading: isCreatingForm } = useFormStore();
  const { setActivePage } = useUIStore();

  // Load the node data when component mounts
  useEffect(() => {
    const loadNodeData = async () => {
      if (!nodeId) {
        setIsLoadingNode(false);
        setNodeLoadError("No node ID provided");
        return;
      }

      setIsLoadingNode(true);
      setNodeLoadError(null);

      try {
        // First try to find the node in the existing nodes array
        let node: TNode | null | undefined = nodes.find(n => n.id === nodeId);
        
        // If not found, try to load it individually
        if (!node) {
          node = await getNode(nodeId);
        }

        if (node) {
          setFormData({
            name: node.name,
            type: node.type,
            nodeGroup: node.nodeGroup,
            description: node.description || "",
            version: node.version || "1.0.0",
            tags: node.tags || [],
            formConfiguration: node.formConfiguration || {},
          });
          
          // Set existing logo if available
          if (node.logo) {
            setLogoPreview(node.logo);
          }
          
          setIsLoadingNode(false);
        } else {
          setNodeLoadError(`Node with ID "${nodeId}" not found`);
          setIsLoadingNode(false);
        }
      } catch (error) {
        setNodeLoadError(`Failed to load node: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoadingNode(false);
      }
    };

    loadNodeData();
  }, [nodeId, nodes, getNode, loadNodes]);

  // Set active page on mount
  useEffect(() => {
    setActivePage("Edit Node");
  }, [setActivePage]);

  const handleInputChange = useCallback((field: keyof TNode, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleVersionChange = useCallback((value: string) => {
    // Only allow semantic versioning format (x.y.z where x, y, z are numbers)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (value === "" || versionRegex.test(value)) {
      setFormData(prev => ({ ...prev, version: value }));
    }
  }, []);

  const handleTagInputChange = useCallback((value: string) => {
    setCurrentTagInput(value);
    
    // Check if user typed a comma
    if (value.includes(',')) {
      const newTag = value.replace(',', '').trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        const updatedTags = [...(formData.tags || []), newTag];
        setFormData(prev => ({ ...prev, tags: updatedTags }));
      }
      setCurrentTagInput(""); // Clear input after adding tag
    }
  }, [formData.tags]);

  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = currentTagInput.trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        const updatedTags = [...(formData.tags || []), newTag];
        setFormData(prev => ({ ...prev, tags: updatedTags }));
      }
      setCurrentTagInput("");
    } else if (e.key === 'Backspace' && currentTagInput === '' && formData.tags && formData.tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      const updatedTags = formData.tags.slice(0, -1);
      setFormData(prev => ({ ...prev, tags: updatedTags }));
    }
  }, [currentTagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    const updatedTags = formData.tags?.filter(tag => tag !== tagToRemove) || [];
    setFormData(prev => ({ ...prev, tags: updatedTags }));
  }, [formData.tags]);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        uiHelpers.showError("Error", "Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        uiHelpers.showError("Error", "File size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoPreview(null);
  }, []);

  const handleFormConfigurationChange = useCallback((json: Record<string, unknown>) => {
    // Only update if the JSON is actually different to prevent unnecessary re-renders
    if (JSON.stringify(formData.formConfiguration) !== JSON.stringify(json)) {
      setFormData(prev => ({ ...prev, formConfiguration: json }));
    }
  }, [formData.formConfiguration]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nodeId) {
      uiHelpers.showError("Error", "Node ID not found");
      return;
    }

    try {
      // Update the node using Zustand store
      await updateNode(nodeId, {
        name: formData.name || "Updated Node",
        type: (formData.type || "action") as TNode['type'],
        nodeGroup: formData.nodeGroup || "",
        description: formData.description || "",
        version: formData.version || "1.0.0",
        tags: formData.tags || [],
        formConfiguration: formData.formConfiguration || {},
        isActive: true,
        logoFile: logoFile || undefined, // Include the logo file if uploaded
      }, true); // showToast = true

      // Form configuration is now stored as part of the node, no need for separate creation

      // Show success notification
      uiHelpers.showSuccess("Success!", "Node updated successfully");

      // Navigate back to nodes page after successful update
      router.push("/nodes");
    } catch (error) {
      uiHelpers.showError("Error", "Failed to update node. Please try again.");
    }
  }, [nodeId, formData, logoFile, updateNode, createFormConfiguration, router]);

  const handleCancel = useCallback(() => {
    router.push("/nodes");
  }, [router]);

  const isUpdating = isUpdatingNode || isCreatingForm;

  return {
    // State
    formData,
    logoFile,
    logoPreview,
    currentTagInput,
    isLoadingNode,
    nodeLoadError,
    isUpdating,
    isPreviewOpen,
    
    // Handlers
    handleInputChange,
    handleVersionChange,
    handleTagInputChange,
    handleTagInputKeyDown,
    removeTag,
    handleLogoUpload,
    handleRemoveLogo,
    handleFormConfigurationChange,
    handleSubmit,
    handleCancel,
    setIsPreviewOpen,
  };
};
