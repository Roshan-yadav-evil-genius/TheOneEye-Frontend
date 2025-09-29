"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { DroppableInput } from "./droppable-input";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ConditionsSectionProps {
  conditions: Condition[];
  logicOperator: "AND" | "OR";
  onConditionsChange: (conditions: Condition[]) => void;
  onLogicOperatorChange: (operator: "AND" | "OR") => void;
}

export function ConditionsSection({
  conditions,
  logicOperator,
  onConditionsChange,
  onLogicOperatorChange
}: ConditionsSectionProps) {
  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: "",
      operator: "equals",
      value: ""
    };
    onConditionsChange([...conditions, newCondition]);
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    onConditionsChange(
      conditions.map(condition => 
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    );
  };

  const removeCondition = (id: string) => {
    onConditionsChange(conditions.filter(condition => condition.id !== id));
  };

  return (
    <div>
      <h4 className="text-white font-medium mb-4">Conditions</h4>
      
      {/* Logic Selector */}
      <div className="flex mb-4">
        <div className="flex bg-gray-800 rounded p-1">
          <button
            onClick={() => onLogicOperatorChange("AND")}
            className={`px-3 py-1 text-sm rounded ${
              logicOperator === "AND" 
                ? "bg-gray-700 text-white" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            AND
          </button>
          <button
            onClick={() => onLogicOperatorChange("OR")}
            className={`px-3 py-1 text-sm rounded ${
              logicOperator === "OR" 
                ? "bg-gray-700 text-white" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            OR
          </button>
        </div>
      </div>

      {/* Condition Rows */}
      <div className="space-y-3">
        {conditions.map((condition) => (
          <div key={condition.id} className="flex items-center gap-2">
            <button className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded">
              fx
            </button>
            <DroppableInput
              value={condition.field}
              onChange={(value) => updateCondition(condition.id, "field", value)}
              placeholder="Field expression"
              id={`condition-field-${condition.id}`}
            />
            <Select value={condition.operator} onValueChange={(value) => updateCondition(condition.id, "operator", value)}>
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
              value={condition.value}
              onChange={(value) => updateCondition(condition.id, "value", value)}
              placeholder="Value"
              id={`condition-value-${condition.id}`}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
            <button
              onClick={() => removeCondition(condition.id)}
              className="text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Condition Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={addCondition}
          variant="outline"
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Condition
        </Button>
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Group
        </Button>
      </div>
    </div>
  );
}
