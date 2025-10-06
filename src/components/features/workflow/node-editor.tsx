"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeHeader } from "./node-header";
import { ParametersTab } from "./parameters-tab";
import { FormFieldsSection } from "@/components/features/nodes/FormFieldsSection";
import { TNode } from "@/types";

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

interface NodeEditorProps {
  nodeType: string;
  nodeLabel: string;
  nodeId: string;
  activeTab: "parameters" | "form";
  onTabChange: (tab: "parameters" | "form") => void;
  // Parameters tab props
  groups: GroupWithOperator[];
  convertTypes: boolean;
  onGroupsChange: (groups: GroupWithOperator[]) => void;
  onConvertTypesChange: (value: boolean) => void;
  // Form tab props
  standaloneNodeData?: TNode | null;
  nodeDataError?: string | null;
  // Header actions
  onTestStep?: () => void;
  onViewDocs?: () => void;
}

export function NodeEditor({
  nodeType,
  nodeLabel,
  nodeId,
  activeTab,
  onTabChange,
  groups,
  convertTypes,
  onGroupsChange,
  onConvertTypesChange,
  standaloneNodeData,
  nodeDataError,
  onTestStep,
  onViewDocs
}: NodeEditorProps) {
  return (
    <div className="border-r border-gray-700 flex flex-col bg-gray-900 overflow-hidden h-full">
      <NodeHeader
        nodeType={nodeType}
        nodeLabel={nodeLabel}
        nodeId={nodeId}
        onTestStep={onTestStep}
        onViewDocs={onViewDocs}
      />

      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "parameters" | "form")} className="flex-1 flex flex-col overflow-hidden min-h-0">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-b border-gray-700 rounded-none flex-shrink-0">
          <TabsTrigger 
            value="parameters" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-pink-500 text-gray-400`}
          >
            Parameters
          </TabsTrigger>
          <TabsTrigger 
            value="form" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
          >
            Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="flex-1 p-4 m-0 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
          <ParametersTab
            groups={groups}
            convertTypes={convertTypes}
            onGroupsChange={onGroupsChange}
            onConvertTypesChange={onConvertTypesChange}
          />
        </TabsContent>

        <TabsContent value="form" className="flex-1 p-4 m-0 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
          {nodeDataError ? (
            <div className="text-red-400 text-center py-8">
              Error: {nodeDataError}
            </div>
          ) : standaloneNodeData ? (
            <FormFieldsSection nodeData={standaloneNodeData} />
          ) : (
            <div className="text-gray-400 text-center py-8">
              No node template data available
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
