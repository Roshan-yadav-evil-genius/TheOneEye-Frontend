"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { DroppableInput } from "./droppable-input";
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

interface ConditionGroup {
  id: string;
  conditions: ConditionWithOperator[];
}

interface ConditionGroupProps {
  group: ConditionGroup;
  onGroupChange: (groupId: string, updatedGroup: ConditionGroup) => void;
  onDeleteGroup: (groupId: string) => void;
  canDelete: boolean;
}

export function ConditionGroupComponent({
  group,
  onGroupChange,
  onDeleteGroup,
  canDelete
}: ConditionGroupProps) {
  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: "",
      operator: "equals",
      value: ""
    };
    const newConditionWithOperator: ConditionWithOperator = {
      condition: newCondition,
      operator: "AND"
    };
    onGroupChange(group.id, {
      ...group,
      conditions: [...group.conditions, newConditionWithOperator]
    });
  };

  const updateCondition = (conditionId: string, field: keyof Condition, value: string) => {
    onGroupChange(group.id, {
      ...group,
      conditions: group.conditions.map(conditionWithOp => 
        conditionWithOp.condition.id === conditionId 
          ? { ...conditionWithOp, condition: { ...conditionWithOp.condition, [field]: value } }
          : conditionWithOp
      )
    });
  };

  const removeCondition = (conditionId: string) => {
    onGroupChange(group.id, {
      ...group,
      conditions: group.conditions.filter(conditionWithOp => conditionWithOp.condition.id !== conditionId)
    });
  };

  const updateConditionOperator = (conditionId: string, operator: "AND" | "OR" | "NOT") => {
    onGroupChange(group.id, {
      ...group,
      conditions: group.conditions.map(conditionWithOp => 
        conditionWithOp.condition.id === conditionId 
          ? { ...conditionWithOp, operator }
          : conditionWithOp
      )
    });
  };

  return (
    <div className="border border-gray-600 rounded-lg p-4 bg-gray-800/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Group</span>
        </div>
        {canDelete && (
          <button
            onClick={() => onDeleteGroup(group.id)}
            className="text-gray-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {group.conditions.map((conditionWithOp, index) => (
          <div key={conditionWithOp.condition.id}>
            {index > 0 && (
              <OperatorBar
                operator={conditionWithOp.operator}
                onOperatorChange={(operator) => updateConditionOperator(conditionWithOp.condition.id, operator)}
                size="sm"
              />
            )}
            <div className="flex items-center gap-2">
              <button className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded">
                fx
              </button>
              <DroppableInput
                value={conditionWithOp.condition.field}
                onChange={(value) => updateCondition(conditionWithOp.condition.id, "field", value)}
                placeholder="Field expression"
                id={`condition-field-${conditionWithOp.condition.id}`}
              />
              <Select value={conditionWithOp.condition.operator} onValueChange={(value) => updateCondition(conditionWithOp.condition.id, "operator", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="equals">equals</SelectItem>
                  <SelectItem value="is greater than">is greater than</SelectItem>
                  <SelectItem value="is less than">is less than</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                </SelectContent>
              </Select>
              <DroppableInput
                value={conditionWithOp.condition.value}
                onChange={(value) => updateCondition(conditionWithOp.condition.id, "value", value)}
                placeholder="Value"
                id={`condition-value-${conditionWithOp.condition.id}`}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <button
                onClick={() => removeCondition(conditionWithOp.condition.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          onClick={addCondition}
          variant="outline"
          size="sm"
          className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Condition
        </Button>
      </div>
    </div>
  );
}
