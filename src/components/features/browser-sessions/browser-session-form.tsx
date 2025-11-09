"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { BROWSER_TYPES, BROWSER_INFO, DEFAULT_BROWSER_ARGS, DEFAULT_USER_AGENTS } from "@/constants/browser-session";
import { BrowserSessionFormData, BrowserSessionFormProps } from "@/types/browser-session";
import { TagsInput } from "@/components/features/nodes";

export function BrowserSessionForm({
  initialData = {},
  onSubmit,
  submitButtonText,
  onCancel,
}: BrowserSessionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<BrowserSessionFormData>({
    defaultValues: {
      name: initialData.name || "",
      description: initialData.description || "",
      browser_type: initialData.browser_type || "chromium",
      playwright_config: initialData.playwright_config ? {
        ...initialData.playwright_config,
        user_agent: initialData.playwright_config.user_agent || DEFAULT_USER_AGENTS[initialData.browser_type || "chromium"],
        args: initialData.playwright_config.args && initialData.playwright_config.args.length > 0 
          ? initialData.playwright_config.args 
          : [...DEFAULT_BROWSER_ARGS],
      } : {
        user_agent: DEFAULT_USER_AGENTS[initialData.browser_type || "chromium"],
        args: [...DEFAULT_BROWSER_ARGS],
        timeout: 30000,
        slow_mo: 0,
      },
    },
    mode: "onChange",
  });

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
      const browserType = initialData.browser_type || "chromium";
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        browser_type: browserType,
        playwright_config: initialData.playwright_config ? {
          ...initialData.playwright_config,
          user_agent: initialData.playwright_config.user_agent || DEFAULT_USER_AGENTS[browserType],
          args: initialData.playwright_config.args && initialData.playwright_config.args.length > 0 
            ? initialData.playwright_config.args 
            : [...DEFAULT_BROWSER_ARGS],
        } : {
          user_agent: DEFAULT_USER_AGENTS[browserType],
          args: [...DEFAULT_BROWSER_ARGS],
          timeout: 30000,
          slow_mo: 0,
        },
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data: BrowserSessionFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Enter session name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters"
            }
          })}
          className={errors.name ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe what this browser session is for"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters"
            }
          })}
          className={errors.description ? "border-red-500" : ""}
          rows={3}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="browser_type">Browser Type *</Label>
        <input
          type="hidden"
          {...register("browser_type", { required: "Browser type is required" })}
        />
        <Select
          value={browserTypeValue}
          onValueChange={(value) => setValue("browser_type", value as any)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={`w-full ${errors.browser_type ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select browser type" />
          </SelectTrigger>
          <SelectContent>
            {BROWSER_TYPES.map((browser) => (
              <SelectItem key={browser.value} value={browser.value}>
                {browser.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {browserTypeValue && BROWSER_INFO[browserTypeValue] && (
          <div className="flex items-start gap-2 mt-1">
            <p className="text-sm text-gray-600 flex-1">
              {BROWSER_INFO[browserTypeValue].description}
            </p>
            <a 
              href={BROWSER_INFO[browserTypeValue].args_reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-0.5"
              aria-label="View browser args reference"
            >
              <ExternalLink className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </a>
          </div>
        )}
        {errors.browser_type && (
          <p className="text-sm text-red-500">{errors.browser_type.message}</p>
        )}
      </div>

      {/* Playwright Configuration */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Playwright Configuration</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="user_agent">User Agent</Label>
            <a 
              href="https://www.useragents.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center"
              aria-label="Visit useragents.me to choose a user agent"
            >
              <ExternalLink className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </a>
          </div>
          <Input
            id="user_agent"
            placeholder="Custom user agent string"
            value={playwrightConfig?.user_agent || ""}
            onChange={(e) => 
              setValue("playwright_config.user_agent", e.target.value)
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <TagsInput
            tags={playwrightConfig?.args || []}
            onTagsChange={(args) => setValue("playwright_config.args", args.length > 0 ? args : undefined)}
            label="Args"
            placeholder="Type an arg and press comma or enter"
            helpText="Type args and press comma or enter to add them"
            id="args"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}




