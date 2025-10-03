"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IconTag, IconX as IconClose } from "@tabler/icons-react";

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsInput({ tags, onTagsChange }: TagsInputProps) {
  const [currentTagInput, setCurrentTagInput] = useState<string>("");

  const handleTagInputChange = (value: string) => {
    setCurrentTagInput(value);
    
    // Check if user typed a comma
    if (value.includes(',')) {
      const newTag = value.replace(',', '').trim();
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        onTagsChange(updatedTags);
      }
      setCurrentTagInput(""); // Clear input after adding tag
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = currentTagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        onTagsChange(updatedTags);
      }
      setCurrentTagInput("");
    } else if (e.key === 'Backspace' && currentTagInput === '' && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      const updatedTags = tags.slice(0, -1);
      onTagsChange(updatedTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      
      {/* Rendered Tags */}
      {tags.length > 0 && (
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
                <IconClose className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Tag Input */}
      <Input
        id="tags"
        value={currentTagInput}
        onChange={(e) => handleTagInputChange(e.target.value)}
        onKeyDown={handleTagInputKeyDown}
        placeholder="Type a tag and press comma or enter"
      />
      <p className="text-sm text-muted-foreground">
        Type tags and press comma or enter to add them
      </p>
    </div>
  );
}
