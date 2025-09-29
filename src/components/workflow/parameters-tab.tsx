"use client";

import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { ConditionsSection } from "./conditions-section";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ConditionWithOperator {
  condition: Condition;
  operator: "AND" | "OR" | "NOT";
}

interface GroupWithOperator {
  group: {
    id: string;
    conditions: ConditionWithOperator[];
  };
  operator: "AND" | "OR" | "NOT";
}

interface ParametersTabProps {
  groups: GroupWithOperator[];
  convertTypes: boolean;
  onGroupsChange: (groups: GroupWithOperator[]) => void;
  onConvertTypesChange: (value: boolean) => void;
}

export function ParametersTab({
  groups,
  convertTypes,
  onGroupsChange,
  onConvertTypesChange
}: ParametersTabProps) {
  return (
    <div className="space-y-6">
      {/* Conditions Section */}
      <ConditionsSection
        groups={groups}
        onGroupsChange={onGroupsChange}
      />

      {/* Convert Types Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-white">Convert types where required</Label>
        <Toggle
          pressed={convertTypes}
          onPressedChange={onConvertTypesChange}
          className="data-[state=on]:bg-orange-600"
        />
      </div>

      {/* Options Section */}
      <div>
        <h4 className="text-white font-medium mb-2">Options</h4>
        <p className="text-gray-400 text-sm">No properties</p>
      </div>
    </div>
  );
}
