"use client";

import { Copy, Download, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DraggableSchema } from './draggable-schema';
import { useState, useMemo } from 'react';
import React from 'react';
import { ChevronRight, ChevronDown, Hash, Type, Folder, FileText } from 'lucide-react';

interface JsonViewerProps {
  title: string;
  statusColor: string;
  jsonData: Record<string, unknown> | unknown[] | string | null;
  activeTab: "schema" | "json";
  onTabChange: (value: "schema" | "json") => void;
  showExecuteButton?: boolean;
  onExecute?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onRefresh?: () => void;
  enableDragDrop?: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

export function JsonViewer({
  title,
  statusColor,
  jsonData,
  activeTab,
  onTabChange,
  onCopy,
  onDownload,
  enableDragDrop = true,
  isLoading = false,
  error = null
}: JsonViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      if (onCopy) {
        onCopy();
      }
    } catch (err) {
      // Failed to copy text
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase()}-data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };


  const filteredJsonData = useMemo(() => {
    if (!searchTerm || activeTab !== "json") {
      return jsonData;
    }
    
    // Simple search implementation - you can enhance this for more complex filtering
    const jsonString = JSON.stringify(jsonData, null, 2);
    const lines = jsonString.split('\n');
    const filteredLines = lines.filter(line => 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredLines.length === 0) {
      return { message: "No matching content found" };
    }
    
    return filteredLines.join('\n');
  }, [jsonData, searchTerm, activeTab]);

  // Add loading state rendering
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Add error state rendering
  if (error) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p className="text-sm">Failed to load data</p>
            <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 ${copySuccess ? 'text-green-400' : ''}`}
            title={copySuccess ? "Copied!" : "Copy JSON"}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={`text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 ${showSearch ? 'bg-gray-700 text-white' : ''}`}
            title="Search JSON"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div></div>
      </div>
      
      {showSearch && (
        <div className="p-2 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setShowSearch(false);
              }}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "schema" | "json")} className="flex-1 flex flex-col overflow-hidden gap-0">
        <TabsList className="grid w-full grid-cols-2 rounded-none flex-shrink-0 !m-0">
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
        
        <TabsContent value="json" className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto sidebar-scrollbar">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                fontSize: '0.875rem',
                height: '100%',
                overflow: 'auto'
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {typeof filteredJsonData === 'string' ? filteredJsonData : JSON.stringify(filteredJsonData, null, 2)}
            </SyntaxHighlighter>
          </div>
        </TabsContent>
        
        <TabsContent value="schema" className="flex-1 m-0 overflow-hidden">
          {enableDragDrop ? (
            <DraggableSchema jsonData={jsonData} title={title} />
          ) : (
            <NonDraggableSchema jsonData={jsonData} title={title} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Non-draggable schema component for output viewer
interface SchemaField {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value?: unknown;
  children?: SchemaField[];
  path: string;
}

interface NonDraggableFieldProps {
  field: SchemaField;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function NonDraggableField({ field, level, isExpanded, onToggle }: NonDraggableFieldProps) {
  const handleClick = (e: React.MouseEvent) => {
    // If clicking on expand button, let it handle the click
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    // Toggle expand/collapse for objects and arrays
    if (field.children && field.children.length > 0) {
      onToggle();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash className="w-3 h-3 text-blue-400" />;
      case 'string':
        return <Type className="w-3 h-3 text-green-400" />;
      case 'boolean':
        return <Hash className="w-3 h-3 text-blue-400" />;
      case 'object':
        return <Folder className="w-3 h-3 text-purple-400" />;
      case 'array':
        return <FileText className="w-3 h-3 text-purple-400" />;
      default:
        return <Type className="w-3 h-3 text-gray-400" />;
    }
  };

  const hasChildren = field.children && field.children.length > 0;
  const isExpandable = hasChildren && (field.type === 'object' || field.type === 'array');

  return (
    <div
      style={{ marginLeft: `${level * 16}px` }}
      onClick={handleClick}
      className="group flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-700/30 transition-colors"
    >
      {isExpandable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-4 h-4 hover:bg-gray-600 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-300" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-300" />
          )}
        </button>
      )}
      
      {!isExpandable && <div className="w-4" />}
      
      {getTypeIcon(field.type)}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-mono bg-gray-600/20 text-gray-300 border border-gray-500/30">
            {field.key}
          </span>
        </div>
        {field.type !== 'object' && field.type !== 'array' && field.value !== undefined && (
          <span className="text-gray-400 font-mono text-sm">
            {typeof field.value === 'string' ? `"${field.value}"` : JSON.stringify(field.value)}
          </span>
        )}
      </div>
    </div>
  );
}

interface NonDraggableSchemaProps {
  jsonData: unknown;
  title: string;
}

function NonDraggableSchema({ jsonData, title }: NonDraggableSchemaProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['[0]', '[1]']));

  const parseJsonToSchema = (data: unknown, key: string = '', path: string = ''): SchemaField[] => {
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        const arrayPath = path ? `${path}[${index}]` : `[${index}]`;
        return {
          key: `[${index}]`,
          type: 'object',
          path: arrayPath,
          children: parseJsonToSchema(item, `[${index}]`, arrayPath)
        };
      });
    } else if (data && typeof data === 'object') {
      return Object.entries(data).map(([k, v]) => {
        const currentPath = path ? `${path}.${k}` : k;
        const field: SchemaField = {
          key: k,
          type: Array.isArray(v) ? 'array' : typeof v as 'string' | 'number' | 'boolean' | 'object',
          path: currentPath,
          value: v
        };

        if (v && typeof v === 'object' && !Array.isArray(v)) {
          field.children = parseJsonToSchema(v, k, currentPath);
        } else if (Array.isArray(v)) {
          field.children = parseJsonToSchema(v, k, currentPath);
        }

        return field;
      });
    } else {
      return [{
        key,
        type: typeof data as 'string' | 'number' | 'boolean' | 'object',
        value: data,
        path: path || key
      }];
    }
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderFields = (fields: SchemaField[], level: number = 0): React.ReactNode => {
    return fields.map((field) => {
      const isExpanded = expandedPaths.has(field.path);
      const hasChildren = field.children && field.children.length > 0;

      return (
        <div key={field.path} className="mb-1">
          <NonDraggableField
            field={field}
            level={level}
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(field.path)}
          />
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderFields(field.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const schemaFields = parseJsonToSchema(jsonData, title, '');

  const getTotalItems = (fields: SchemaField[]): number => {
    let count = 0;
    const countRecursive = (fieldList: SchemaField[]) => {
      fieldList.forEach(field => {
        count++;
        if (field.children) {
          countRecursive(field.children);
        }
      });
    };
    countRecursive(fields);
    return count;
  };

  const totalItems = getTotalItems(schemaFields);

  return (
    <div className="h-full overflow-auto p-4 sidebar-scrollbar">
      <div className="mb-3 text-gray-400 text-sm">
        {totalItems} items
      </div>
      <div className="space-y-0">
        {schemaFields.length > 0 ? (
          renderFields(schemaFields)
        ) : (
          <div className="text-gray-500 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
}
