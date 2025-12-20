import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_USER_AGENTS } from "@/constants/browser-session";
import { BrowserSessionFormData, BrowserSessionFormProps } from "@/types/browser-session";

export function useBrowserSessionForm(
  initialData: BrowserSessionFormProps["initialData"] = {},
  onSubmit: BrowserSessionFormProps["onSubmit"]
) {
  const form = useForm<BrowserSessionFormData>({
    defaultValues: getDefaultValues(initialData),
    mode: "onChange",
  });

  const { reset, setValue, watch } = form;
  const browserTypeValue = watch("browser_type");
  const playwrightConfig = watch("playwright_config");

  // Update user agent when browser type changes (only if user_agent is empty or matches a default)
  useEffect(() => {
    if (browserTypeValue) {
      const currentUserAgent = playwrightConfig?.user_agent || "";
      const defaultUserAgent = DEFAULT_USER_AGENTS[browserTypeValue];
      
      // Update user agent if it's empty or matches one of the default user agents
      const isDefaultUserAgent = Object.values(DEFAULT_USER_AGENTS).includes(currentUserAgent as any);
      
      if (!currentUserAgent || isDefaultUserAgent) {
        setValue("playwright_config.user_agent", defaultUserAgent);
      }
    }
  }, [browserTypeValue, playwrightConfig?.user_agent, setValue]);

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
      ? {
          ...initialData.playwright_config,
          user_agent:
            initialData.playwright_config.user_agent ||
            DEFAULT_USER_AGENTS[browserType],
        }
      : {
          user_agent: DEFAULT_USER_AGENTS[browserType],
          timeout: 30000,
          slow_mo: 0,
        },
  };
}
