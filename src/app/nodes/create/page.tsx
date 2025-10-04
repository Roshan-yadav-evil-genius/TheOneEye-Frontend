"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FormConfigurationEditor } from "@/components/common/form-configuration-editor";
import { NodePreview } from "@/components/NodePreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodeForm, TagsInput, LogoUpload, FormActions } from "@/components/create-node";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useCreateNodePage } from "@/hooks/useCreateNodePage";

function CreateNodePageContent() {
  const {
    control,
    formData,
    errors,
    logoPreview,
    isPreviewOpen,
    isCreating,
    handleSubmit,
    handleVersionChange,
    handleTagsChange,
    handleLogoChange,
    handleFormConfigurationChange,
    onSubmit,
    onError,
    setIsPreviewOpen,
  } = useCreateNodePage();

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

export default function Page() {
  return (
    <DashboardLayout title="Create Node">
      <CreateNodePageContent />
    </DashboardLayout>
  )
}