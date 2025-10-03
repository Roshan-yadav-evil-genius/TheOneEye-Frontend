"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconArrowLeft, IconDeviceFloppy, IconSettings, IconForms } from "@tabler/icons-react";
import { Node, nodeTypes, nodeCategories } from "@/data/nodes";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";

export function EditNodePage() {
  const router = useRouter();
  const params = useParams();
  const nodeId = params.id as string;
  
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState<Partial<Node>>({
    name: "",
    type: "action",
    category: "system",
    description: "",
    version: "1.0.0",
    tags: [],
    formConfiguration: {},
  });
  const [isLoadingNode, setIsLoadingNode] = useState(true);
  const [nodeLoadError, setNodeLoadError] = useState<string | null>(null);

  // Zustand store hooks
  const { 
    nodes, 
    updateNode, 
    getNode,
    loadNodes,
    isLoading: isUpdatingNode, 
    error: nodeError 
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
          console.log('Node not found in store, fetching individually...');
          node = await getNode(nodeId);
        }

        if (node) {
          console.log('Node loaded successfully:', node);
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
          console.log('Node not found after all attempts');
          setNodeLoadError(`Node with ID "${nodeId}" not found`);
          setIsLoadingNode(false);
        }
      } catch (error) {
        console.error('Error loading node:', error);
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

  const handleInputChange = (field: keyof Node, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleFormConfigurationChange = useCallback((json: any) => {
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
      console.error("Error updating node:", error);
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
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Nodes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/nodes")}
          className="flex items-center gap-2"
        >
          <IconArrowLeft className="h-4 w-4" />
          Back to Nodes
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Node</h1>
          <p className="text-muted-foreground">
            Update the configuration for "{formData.name}"
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <IconSettings className="h-4 w-4" />
            Node Details
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-2">
            <IconForms className="h-4 w-4" />
            Form Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      onChange={(e) => handleInputChange("version", e.target.value)}
                      placeholder="1.0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select 
                      value={formData.type || "action"} 
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
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
                      <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-sm text-muted-foreground">
                    Separate multiple tags with commas
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isUpdating || !formData.name}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy className="h-4 w-4" />
                        Update Node
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/nodes")}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Configuration</CardTitle>
              <CardDescription>
                Form configuration functionality has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The form configuration feature is no longer available.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
