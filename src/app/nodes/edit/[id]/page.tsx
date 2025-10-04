"use client";

import Image from "next/image";
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
import { nodeTypes, nodeCategories } from "@/types";
import { FormConfigurationEditor } from "@/components/common/form-configuration-editor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useEditNodePage } from "@/hooks/useEditNodePage";

function EditNodePageContent() {
  const {
    formData,
    logoPreview,
    currentTagInput,
    isLoadingNode,
    nodeLoadError,
    isUpdating,
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
  } = useEditNodePage();

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
          <Button onClick={handleCancel} variant="outline">
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
                        <div className="relative h-12 w-12">
                          <Image 
                            src={logoPreview} 
                            alt="Logo preview" 
                            width={48}
                            height={48}
                            className="h-12 w-12 object-cover rounded border"
                            onError={() => {
                              // Hide the broken image and show upload area instead
                              setLogoPreview(null);
                            }}
                          />
                        </div>
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

              {/* Form Configuration Component */}
              <div className="space-y-2">
                <Label>Form Configuration</Label>
                <FormConfigurationEditor
                  value={formData.formConfiguration || {}}
                  onChange={handleFormConfigurationChange}
                  disabled={isUpdating}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
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
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout title="Edit Node">
      <EditNodePageContent />
    </DashboardLayout>
  )
}