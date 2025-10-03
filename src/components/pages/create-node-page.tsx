"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { IconArrowLeft, IconPlus, IconSettings, IconForms } from "@tabler/icons-react";
import { Node, nodeTypes, nodeCategories } from "@/data/nodes";
import { useNodesStore, useFormStore, useUIStore, uiHelpers } from "@/stores";

export function CreateNodePage() {
  const router = useRouter();
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

  // Zustand store hooks
  const { createNode, isLoading: isCreatingNode, error: nodeError } = useNodesStore();
  const { createFormConfiguration, isLoading: isCreatingForm } = useFormStore();
  const { setActivePage } = useUIStore();

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

  // Set active page on mount
  useEffect(() => {
    setActivePage("Create Node");
  }, [setActivePage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create the node using Zustand store
      const newNode = await createNode({
        name: formData.name || "New Node",
        type: (formData.type || "action") as Node['type'],
        category: formData.category || "system",
        description: formData.description || "",
        version: formData.version || "1.0.0",
        tags: formData.tags || [],
        formConfiguration: formData.formConfiguration || {},
        isActive: true,
      });

      // Create associated form configuration if it exists
      if (formData.formConfiguration && Object.keys(formData.formConfiguration).length > 0) {
        await createFormConfiguration({
          name: `${formData.name} Configuration`,
          description: `Form configuration for ${formData.name}`,
          json: formData.formConfiguration,
          nodeId: newNode.id,
        });
      }

      // Show success notification
      uiHelpers.showSuccess("Success!", "Node created successfully");

      // Navigate back to nodes page after successful creation
      router.push("/nodes");
    } catch (error) {
      console.error("Error creating node:", error);
      uiHelpers.showError("Error", "Failed to create node. Please try again.");
    }
  };

  const isCreating = isCreatingNode || isCreatingForm;

  return (
    <div className="space-y-6">
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
          {/* Create Node Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPlus className="h-5 w-5" />
                Node Details
              </CardTitle>
              <CardDescription>
                Fill in the details for your new workflow node
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
                    disabled={isCreating || !formData.name}
                    className="flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <IconPlus className="h-4 w-4" />
                        Create Node
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/nodes")}
                    disabled={isCreating}
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
