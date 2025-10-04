"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsTabProps {
  label: string;
  description: string;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function SettingsTab({
  label,
  description,
  onLabelChange,
  onDescriptionChange
}: SettingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="label" className="text-white">Label</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          placeholder="Node label"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          placeholder="Node description"
        />
      </div>
    </div>
  );
}
