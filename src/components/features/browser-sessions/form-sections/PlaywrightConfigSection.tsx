import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { TagsInput } from "@/components/features/nodes";
import { BrowserSessionFormData } from "@/types/browser-session";

interface PlaywrightConfigSectionProps {
  form: UseFormReturn<BrowserSessionFormData>;
  playwrightConfig: BrowserSessionFormData["playwright_config"];
  isSubmitting: boolean;
}

export function PlaywrightConfigSection({
  form,
  playwrightConfig,
  isSubmitting,
}: PlaywrightConfigSectionProps) {
  const { setValue } = form;

  return (
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
          onChange={(e) => setValue("playwright_config.user_agent", e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <TagsInput
          tags={playwrightConfig?.args || []}
          onTagsChange={(args) =>
            setValue("playwright_config.args", args.length > 0 ? args : undefined)
          }
          label="Args"
          placeholder="Type an arg and press comma or enter"
          helpText="Type args and press comma or enter to add them"
          id="args"
        />
      </div>
    </div>
  );
}


