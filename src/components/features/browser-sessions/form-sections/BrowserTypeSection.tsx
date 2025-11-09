import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { BROWSER_TYPES, BROWSER_INFO } from "@/constants/browser-session";
import { BrowserSessionFormData } from "@/types/browser-session";

interface BrowserTypeSectionProps {
  form: UseFormReturn<BrowserSessionFormData>;
  browserTypeValue: "chromium" | "firefox" | "webkit";
  isSubmitting: boolean;
}

export function BrowserTypeSection({
  form,
  browserTypeValue,
  isSubmitting,
}: BrowserTypeSectionProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  return (
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
        <SelectTrigger
          className={`w-full ${errors.browser_type ? "border-red-500" : ""}`}
        >
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
  );
}


