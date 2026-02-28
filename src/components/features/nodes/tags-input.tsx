"use client";

import { useState, useMemo, useRef, useEffect, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  helpText?: string;
  id?: string;
  disabled?: boolean;
  suggestions?: string[];
}

export function TagsInput({
  tags,
  onTagsChange,
  label,
  placeholder = "Type to search or add a tag",
  helpText,
  id,
  disabled = false,
  suggestions = [],
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim() || suggestions.length === 0) return [];
    const q = inputValue.trim().toLowerCase();
    return suggestions.filter(
      (s) =>
        s.toLowerCase().includes(q) && !tags.includes(s)
    );
  }, [inputValue, suggestions, tags]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredSuggestions.length, inputValue]);

  const showSuggestions =
    suggestions.length > 0 &&
    isInputFocused &&
    inputValue.trim().length > 0 &&
    filteredSuggestions.length > 0;

  const addTag = (value?: string) => {
    const toAdd = (value ?? inputValue).trim().replace(/,+$/, "");
    if (toAdd && !tags.includes(toAdd)) {
      onTagsChange([...tags, toAdd]);
      setInputValue("");
      setHighlightedIndex(0);
      inputRef.current?.focus();
    }
  };

  const addSuggestion = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onTagsChange([...tags, suggestion]);
      setInputValue("");
      setHighlightedIndex(0);
    }
    inputRef.current?.focus();
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputValue("");
      setHighlightedIndex(0);
      return;
    }

    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) =>
          i < filteredSuggestions.length - 1 ? i + 1 : i
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => (i > 0 ? i - 1 : 0));
        return;
      }
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const selected = filteredSuggestions[highlightedIndex];
        if (selected) {
          addSuggestion(selected);
        } else {
          addTag();
        }
        return;
      }
    }

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="border rounded-md bg-background">
        {/* Section 1: Tags (with × to remove) */}
        <div className="flex flex-wrap gap-2 p-2 max-h-[120px] overflow-y-auto min-h-[40px]">
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-sm">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:text-destructive focus:outline-none rounded"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>

        {/* Section 2: Input */}
        <div className="border-t p-2">
          <Input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              addTag();
              setTimeout(() => setIsInputFocused(false), 150);
            }}
            onFocus={() => setIsInputFocused(true)}
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            disabled={disabled}
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto"
          />
        </div>

        {/* Section 3: Suggestions (same chip style with + to add) */}
        {showSuggestions && (
          <div className="border-t p-2 max-h-[180px] overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((suggestion, index) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className={`flex items-center gap-1 px-2 py-1 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-muted ring-1 ring-primary"
                      : "hover:bg-muted"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addSuggestion(suggestion);
                  }}
                >
                  <span className="text-sm">{suggestion}</span>
                  <Plus className="h-3 w-3 text-muted-foreground" aria-hidden />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}
