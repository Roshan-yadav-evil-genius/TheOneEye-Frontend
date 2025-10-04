import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uiHelpers } from "@/stores";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface LogoUploadProps {
  onLogoChange: (file: File | null, preview: string | null) => void;
}

export function LogoUpload({ onLogoChange }: LogoUploadProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        uiHelpers.showError("Error", "Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        uiHelpers.showError("Error", "File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setLogoPreview(preview);
        onLogoChange(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    onLogoChange(null, null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="logo">Logo</Label>
      <div className="space-y-2">
        {logoPreview ? (
          <div className="flex items-center gap-2">
            <Image
              src={logoPreview}
              alt="Logo preview"
              width={48}
              height={48}
              className="h-12 w-12 object-cover rounded border"
            />
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
                <Label
                  htmlFor="logo-upload-input"
                  className="cursor-pointer text-sm font-medium"
                >
                  Upload Logo
                </Label>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
            <Input
              id="logo-upload-input"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}