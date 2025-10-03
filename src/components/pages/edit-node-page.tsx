"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconDeviceFloppy, IconUpload, IconX, IconX as IconClose, IconTag } from "@tabler/icons-react";
import { TNode, nodeTypes, nodeCategories } from "@/types";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";
import { FormConfigurationEditor } from "@/components/common/form-configuration-editor";

export function EditNodePage() {
  const router = useRouter();
  const params = useParams();
  const nodeId = params.id as string;
  
  const [formData, setFormData] = useState<Partial<TNode>>({
    name: "",
    type: "action",
    category: "system",
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
        let node = nodes.find(n => n.id === nodeId);
        
        // If not found, try to load it individually
        if (!node) {
          node = await getNode(nodeId);
        }

        if (node) {
          setFormData({
            name: node.name,
            type: node.type,
            category: node.category,
            description: node.description || "",
            version: node.version || "1.0.0",
            tags: node.tags || [],
            formConfiguration: node.formConfiguration || {},
          });
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

  const handleInputChange = (field: keyof TNode, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVersionChange = (value: string) => {
    // Only allow semantic versioning format (x.y.z where x, y, z are numbers)
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (value === "" || versionRegex.test(value)) {
      setFormData(prev => ({ ...prev, version: value }));
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleTagInputChange = (value: string) => {
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
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = formData.tags?.filter(tag => tag !== tagToRemove) || [];
    setFormData(prev => ({ ...prev, tags: updatedTags }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleFormConfigurationChange = useCallback((json: Record<string, unknown>) => {
    // Only update if the JSON is actually different to prevent unnecessary re-renders
    if (JSON.stringify(formData.formConfiguration) !== JSON.stringify(json)) {
      setFormData(prev => ({ ...prev, formConfiguration: json }));
    }
  }, [formData.formConfiguration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nodeId) {
      uiHelpers.showError("Error", "Node ID not found");
      return;
    }

    try {
      // Update the node using Zustand store
      await updateNode(nodeId, {
        name: formData.name || "Updated Node",
        type: (formData.type || "action") as Node['type'],
        category: formData.category || "system",
        description: formData.description || "",
        version: formData.version || "1.0.0",
        tags: formData.tags || [],
        formConfiguration: formData.formConfiguration || {},
        isActive: true,
      }, true); // showToast = true

      // Create associated form configuration if it exists and is different
      if (formData.formConfiguration && Object.keys(formData.formConfiguration).length > 0) {
        await createFormConfiguration({
          name: `${formData.name} Configuration`,
          description: `Form configuration for ${formData.name}`,
          json: formData.formConfiguration,
          nodeId: nodeId,
        });
      }

      // Show success notification
      uiHelpers.showSuccess("Success!", "Node updated successfully");

      // Navigate back to nodes page after successful update
      router.push("/nodes");
    } catch (error) {
      uiHelpers.showError("Error", "Failed to update node. Please try again.");
    }
  };

  const isUpdating = isUpdatingNode || isCreatingForm;

  // Show loading state while loading node data
  if (isLoadingNode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-background border-t-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading node data...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error loading the node
  if (nodeLoadError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">Error Loading Node</p>
          <p className="text-muted-foreground mb-4">{nodeLoadError}</p>
          <Button onClick={() => router.push("/nodes")} variant="outline">
            Back to Nodes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="space-y-6">
        {/* Edit Node Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDeviceFloppy className="h-5 w-5" />
              Node Details
            </CardTitle>
            <CardDescription>
              Update the details for your workflow node
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Node Name and Version in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Node Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter node name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version || "1.0.0"}
                    onChange={(e) => handleVersionChange(e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              {/* Type and Category dropdowns taking full width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={formData.type || "action"} 
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodeTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category || "system"} 
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodeCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags and Logo upload in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  
                  {/* Rendered Tags */}
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <IconTag className="h-3 w-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                          >
                            <IconClose className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Tag Input */}
                  <Input
                    id="tags"
                    value={currentTagInput}
                    onChange={(e) => handleTagInputChange(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Type a tag and press comma or enter"
                  />
                  <p className="text-sm text-muted-foreground">
                    Type tags and press comma or enter to add them
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="space-y-2">
                    {logoPreview ? (
                      <div className="flex items-center gap-2">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="h-12 w-12 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-1"
                        >
                          <IconX className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <div className="flex flex-col items-center gap-2">
                          <IconUpload className="h-6 w-6 text-muted-foreground" />
                          <div className="text-center">
                            <Label htmlFor="logo" className="cursor-pointer text-sm font-medium">
                              Upload Logo
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </div>
                        <input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this node does"
                  rows={4}
                />
              </div>

            </form>
          </CardContent>
        </Card>

        {/* Form Configuration Component */}
        <FormConfigurationEditor
          value={formData.formConfiguration}
          onChange={handleFormConfigurationChange}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
}
