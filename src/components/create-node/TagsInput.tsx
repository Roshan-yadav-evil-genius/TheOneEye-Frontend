import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconTag, IconX } from "@tabler/icons-react";
import { useState } from "react";

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsInput({ tags, onTagsChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              <IconTag className="h-3 w-3 mr-1" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <IconX className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        id="tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type a tag and press comma or enter"
      />
      <p className="text-sm text-muted-foreground">
        Type tags and press comma or enter to add them
      </p>
    </div>
  );
}