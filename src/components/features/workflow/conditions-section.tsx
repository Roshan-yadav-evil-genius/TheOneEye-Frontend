"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ConditionGroupComponent } from "./condition-group";
import { OperatorBar } from "./operator-bar";

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

interface ConditionsSectionProps {
  groups: GroupWithOperator[];
  onGroupsChange: (groups: GroupWithOperator[]) => void;
}

export function ConditionsSection({
  groups,
  onGroupsChange
}: ConditionsSectionProps) {
  const addGroup = () => {
    const newCondition: Condition = {
      id: Date.now().toString() + "_condition",
      field: "",
      operator: "equals",
      value: ""
    };
    const newConditionWithOperator: ConditionWithOperator = {
      condition: newCondition,
      operator: "AND"
    };
    const newGroupWithOperator: GroupWithOperator = {
      group: {
        id: Date.now().toString(),
        conditions: [newConditionWithOperator]
      },
      operator: "AND"
    };
    onGroupsChange([...groups, newGroupWithOperator]);
  };

  const updateGroup = (groupId: string, updatedGroup: { id: string; conditions: ConditionWithOperator[] }) => {
    onGroupsChange(
      groups.map(groupWithOp => 
        groupWithOp.group.id === groupId 
          ? { ...groupWithOp, group: updatedGroup }
          : groupWithOp
      )
    );
  };

  const deleteGroup = (groupId: string) => {
    onGroupsChange(groups.filter(groupWithOp => groupWithOp.group.id !== groupId));
  };

  const updateGroupOperator = (groupId: string, operator: "AND" | "OR" | "NOT") => {
    onGroupsChange(
      groups.map(groupWithOp => 
        groupWithOp.group.id === groupId 
          ? { ...groupWithOp, operator }
          : groupWithOp
      )
    );
  };

  return (
    <div className="h-full flex flex-col min-h-0">


      {/* Condition Groups - Scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pr-2 min-h-0 sidebar-scrollbar">
        {groups.map((groupWithOp, index) => (
          <div key={groupWithOp.group.id}>
            {index > 0 && (
              <OperatorBar
                operator={groupWithOp.operator}
                onOperatorChange={(operator) => updateGroupOperator(groupWithOp.group.id, operator)}
                size="md"
              />
            )}
            <ConditionGroupComponent
              group={groupWithOp.group}
              onGroupChange={updateGroup}
              onDeleteGroup={deleteGroup}
              canDelete={groups.length > 1}
            />
          </div>
        ))}
      </div>

      {/* Add Group Button - Fixed at bottom */}
      <div className="mt-4 flex-shrink-0">
        <Button
          onClick={addGroup}
          variant="outline"
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Group
        </Button>
      </div>
    </div>
  );
}
