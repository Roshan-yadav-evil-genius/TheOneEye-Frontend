"use client";

import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InputSectionProps {
  activeInputTab: "schema" | "json";
  onInputTabChange: (value: "schema" | "json") => void;
}

export function InputSection({ activeInputTab, onInputTabChange }: InputSectionProps) {
  return (
    <div className="w-1/3 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">INPUT</h3>
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      
      <Tabs value={activeInputTab} onValueChange={onInputTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-b border-gray-700 rounded-none">
          <TabsTrigger 
            value="schema" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
          >
            Schema
          </TabsTrigger>
          <TabsTrigger 
            value="json" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
          >
            JSON
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="json" className="flex-1 p-4 m-0">
          <div className="bg-gray-800 rounded p-4 h-full overflow-auto">
            <pre className="text-sm text-gray-300">
{`[
  {
    "row_number": 2,
    "Name": "Kenneth Smith",
    "Age": 51,
    "master": {
      "c1": 1,
      "c2": 2,
      "nested": {
        "deepkey": "deepValue"
      }
    }
  },
  {
    "row_number": 3,
    "Name": "Jane Doe",
    "Age": 28,
    "master": {
      "c1": 3,
      "c2": 4,
      "nested": {
        "deepkey": "anotherValue"
      }
    }
  }
]`}
            </pre>
          </div>
        </TabsContent>
        
        <TabsContent value="schema" className="flex-1 p-4 m-0">
          <div className="bg-gray-800 rounded p-4 h-full">
            <p className="text-gray-400 text-sm">Schema view would go here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
