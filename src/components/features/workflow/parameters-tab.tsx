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
    <div className="h-full flex flex-col">
      {/* Conditions Section */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ConditionsSection
          groups={groups}
          onGroupsChange={onGroupsChange}
        />
      </div>

      {/* Convert Types Toggle */}

    </div>
  );
}
