"use client";

import { useBrowserSessionForm } from "@/hooks/useBrowserSessionForm";
import { BrowserSessionFormProps } from "@/types/browser-session";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { BrowserTypeSection } from "./form-sections/BrowserTypeSection";
import { PlaywrightConfigSection } from "./form-sections/PlaywrightConfigSection";
import { FormActions } from "./form-sections/FormActions";

export function BrowserSessionForm({
  initialData = {},
  onSubmit,
  submitButtonText,
  onCancel,
}: BrowserSessionFormProps) {
  const { form, handleFormSubmit, browserTypeValue, playwrightConfig } =
    useBrowserSessionForm(initialData, onSubmit);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <BasicInfoSection form={form} isSubmitting={isSubmitting} />
      <BrowserTypeSection
        form={form}
        browserTypeValue={browserTypeValue}
        isSubmitting={isSubmitting}
      />
      <PlaywrightConfigSection
        form={form}
        playwrightConfig={playwrightConfig}
        isSubmitting={isSubmitting}
      />
      <FormActions
        onCancel={onCancel}
        submitButtonText={submitButtonText}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}




