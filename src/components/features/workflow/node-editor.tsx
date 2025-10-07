"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeHeader } from "./node-header";
import { FormFieldsSection } from "@/components/features/nodes/FormFieldsSection";
import { BackendWorkflowNode } from "@/types/api/backend";

interface NodeEditorProps {
  data: BackendWorkflowNode;
  activeTab: "parameters" | "form";
  onTabChange: (tab: "parameters" | "form") => void;
  onTestStep?: () => void;
  onViewDocs?: () => void;
}

export function NodeEditor({
  data,
  activeTab,
  onTabChange,
  onTestStep,
  onViewDocs
}: NodeEditorProps) {
  return (
    <div className="border-r border-gray-700 flex flex-col bg-gray-900 overflow-hidden h-full">
      <NodeHeader
        nodeType={data.node_type?.type || "unknown"}
        nodeLabel={data.node_type?.name || "Unknown Node"}
        nodeId={data.id}
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
          <div className="text-gray-400 text-center py-8">
            Parameters configuration coming soon
          </div>
        </TabsContent>

        <TabsContent value="form" className="flex-1 p-4 m-0 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
          {data?.node_type?.form_configuration ? (
            <FormFieldsSection node_type={{...data.node_type}} />
          ) : (
            <div className="text-gray-400 text-center py-8">
              No form configuration available
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
