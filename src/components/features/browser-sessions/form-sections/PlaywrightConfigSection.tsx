import { UseFormReturn } from "react-hook-form";
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
  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-medium">Playwright Configuration</h3>
      {/* User Agent field removed - hardcoded in backend if needed */}
    </div>
  );
}
