import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TNode, nodeTypes } from "@/types";
import { useNodeGroups } from "@/hooks/useNodeGroups";

interface NodeFormProps {
  control: Control<Partial<TNode>>;
  errors: FieldErrors<Partial<TNode>>;
  onVersionChange: (value: string) => void;
}

export function NodeForm({ control, errors, onVersionChange }: NodeFormProps) {
  const { nodeGroups, isLoading: isLoadingGroups } = useNodeGroups();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Node Name *</Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => <Input {...field} placeholder="Enter node name" />}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Controller
            name="version"
            control={control}
            render={({ field }) => <Input {...field} onChange={(e) => {
              field.onChange(e);
              onVersionChange(e.target.value);
            }} placeholder="1.0.0" />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {nodeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nodeGroup">Group *</Label>
          <Controller
            name="nodeGroup"
            control={control}
            rules={{ required: "Group is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingGroups}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoadingGroups ? "Loading groups..." : "Select group"} />
                </SelectTrigger>
                <SelectContent>
                  {nodeGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.nodeGroup && <p className="text-red-500 text-sm">{errors.nodeGroup.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
            name="description"
            control={control}
            render={({ field }) => <Textarea {...field} placeholder="Describe what this node does" rows={4} />}
          />
      </div>
    </>
  );
}