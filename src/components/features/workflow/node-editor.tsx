"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeHeader } from "./node-header";
import { ParametersTab } from "./parameters-tab";
import { SettingsTab } from "./settings-tab";
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
  activeTab: "parameters" | "settings" | "form";
  onTabChange: (tab: "parameters" | "settings" | "form") => void;
  // Parameters tab props
  groups: GroupWithOperator[];
  convertTypes: boolean;
  onGroupsChange: (groups: GroupWithOperator[]) => void;
  onConvertTypesChange: (value: boolean) => void;
  // Settings tab props
  label: string;
  description: string;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  // Form tab props
  standaloneNodeData?: TNode | null;
  isLoadingNodeData?: boolean;
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
  label,
  description,
  onLabelChange,
  onDescriptionChange,
  standaloneNodeData,
  isLoadingNodeData,
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

      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "parameters" | "settings" | "form")} className="flex-1 flex flex-col overflow-hidden min-h-0">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-b border-gray-700 rounded-none flex-shrink-0">
          <TabsTrigger 
            value="parameters" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-pink-500 text-gray-400`}
          >
            Parameters
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
          >
            Settings
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

        <TabsContent value="settings" className="flex-1 p-4 m-0 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
          <SettingsTab
            label={label}
            description={description}
            onLabelChange={onLabelChange}
            onDescriptionChange={onDescriptionChange}
          />
        </TabsContent>

        <TabsContent value="form" className="flex-1 p-4 m-0 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
          {isLoadingNodeData ? (
            <div className="text-gray-400 text-center py-8">
              Loading node information...
            </div>
          ) : nodeDataError ? (
            <div className="text-red-400 text-center py-8">
              Error loading node data: {nodeDataError}
            </div>
          ) : standaloneNodeData ? (
            <FormFieldsSection nodeData={standaloneNodeData} />
          ) : (
            <div className="text-gray-400 text-center py-8">
              No node data available
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
