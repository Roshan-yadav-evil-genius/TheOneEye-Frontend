import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BrowserSessionFormData, BrowserSessionFormProps } from "@/types/browser-session";

export function useBrowserSessionForm(
  initialData: BrowserSessionFormProps["initialData"] = {},
  onSubmit: BrowserSessionFormProps["onSubmit"]
) {
  const form = useForm<BrowserSessionFormData>({
    defaultValues: getDefaultValues(initialData),
    mode: "onChange",
  });

  const { reset, watch } = form;
  const browserTypeValue = watch("browser_type");
  const playwrightConfig = watch("playwright_config");

  // Update form when initialData changes
  useEffect(() => {
    if (initialData.name || initialData.description || initialData.browser_type || initialData.playwright_config) {
      reset(getDefaultValues(initialData));
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: BrowserSessionFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return {
    form,
    handleFormSubmit,
    browserTypeValue,
    playwrightConfig,
  };
}

function getDefaultValues(initialData: Partial<BrowserSessionFormData> = {}) {
  const browserType = initialData.browser_type || "chromium";
  
  return {
    name: initialData.name || "",
    description: initialData.description || "",
    browser_type: browserType,
    playwright_config: initialData.playwright_config
      ? { ...initialData.playwright_config }
      : {
          timeout: 30000,
          slow_mo: 0,
        },
  };
}
