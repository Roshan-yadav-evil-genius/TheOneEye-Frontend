"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconInfoCircle, IconTag } from "@tabler/icons-react";
import { Node } from "@/data/nodes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NodePreviewProps {
  nodeData: Partial<Node>;
  logoPreview?: string | null;
}

export function NodePreview({ nodeData, logoPreview }: NodePreviewProps) {
  const renderFormFields = () => {
    if (!nodeData.formConfiguration || Object.keys(nodeData.formConfiguration).length === 0) {
      return (
        <div className="text-sm text-muted-foreground italic">
          No form fields configured
        </div>
      );
    }

    // Check if we have widgets in the form configuration
    const widgets = (nodeData.formConfiguration as any)?.widgets;
    if (!widgets || !Array.isArray(widgets) || widgets.length === 0) {
      return (
        <div className="text-sm text-muted-foreground italic">
          No form fields configured
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-sm font-medium text-foreground mb-3">
          Form Fields ({widgets.length} field{widgets.length !== 1 ? 's' : ''}):
        </div>
        <div className="grid gap-3">
          {widgets.map((widget: any, index: number) => (
            <div key={widget.id || index} className="border rounded-lg p-3 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{widget.label || `Field ${index + 1}`}</span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {widget.type}
                  </span>
                  {widget.required && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                      Required
                    </span>
                  )}
                </div>
              </div>
              
              {/* Render preview of the field based on type */}
              <div className="text-sm text-muted-foreground">
                {renderFieldPreview(widget)}
              </div>
              
              {widget.placeholder && (
                <div className="text-xs text-muted-foreground mt-1">
                  Placeholder: "{widget.placeholder}"
                </div>
              )}
              
              {widget.options && widget.options.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Options: {widget.options.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFieldPreview = (widget: any) => {
    switch (widget.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <div className="w-full h-8 bg-background border rounded px-3 flex items-center text-muted-foreground">
            {widget.placeholder || `Enter ${widget.type}...`}
          </div>
        );
      case 'number':
        return (
          <div className="w-full h-8 bg-background border rounded px-3 flex items-center text-muted-foreground">
            {widget.placeholder || "Enter number..."}
          </div>
        );
      case 'textarea':
        return (
          <div className="w-full h-16 bg-background border rounded px-3 py-2 text-muted-foreground">
            {widget.placeholder || "Enter text..."}
          </div>
        );
      case 'select':
        return (
          <div className="w-full h-8 bg-background border rounded px-3 flex items-center text-muted-foreground">
            {widget.placeholder || "Select an option..."}
          </div>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded bg-background"></div>
            <span className="text-muted-foreground">Checkbox option</span>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-1">
            {widget.options?.slice(0, 2).map((option: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-4 h-4 border rounded-full bg-background"></div>
                <span className="text-muted-foreground">{option}</span>
              </div>
            ))}
            {widget.options?.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{widget.options.length - 2} more options
              </div>
            )}
          </div>
        );
      case 'date':
        return (
          <div className="w-full h-8 bg-background border rounded px-3 flex items-center text-muted-foreground">
            Select date...
          </div>
        );
      case 'file':
        return (
          <div className="w-full h-8 bg-background border-2 border-dashed rounded px-3 flex items-center text-muted-foreground">
            Choose file...
          </div>
        );
      default:
        return (
          <div className="w-full h-8 bg-background border rounded px-3 flex items-center text-muted-foreground">
            {widget.type} field
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            {/* Top-left: Logo, name with info button */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Node logo" 
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="h-16 w-16 bg-muted rounded-lg border flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {nodeData.name?.charAt(0).toUpperCase() || "N"}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-foreground truncate">
                    {nodeData.name || "Unnamed Node"}
                  </h1>
                  {nodeData.description && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex-shrink-0">
                            <IconInfoCircle className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p>{nodeData.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                
                {/* Tags */}
                {nodeData.tags && nodeData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {nodeData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <IconTag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Version */}
                <div className="text-sm text-muted-foreground">
                  Version: {nodeData.version || "1.0.0"}
                </div>
              </div>
            </div>

            {/* Top-right: Type, category, separator */}
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">Type: </span>
                  <Badge variant="outline" className="ml-1">
                    {nodeData.type?.charAt(0).toUpperCase() + nodeData.type?.slice(1) || "Action"}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Category: </span>
                  <Badge variant="outline" className="ml-1">
                    {nodeData.category?.charAt(0).toUpperCase() + nodeData.category?.slice(1) || "System"}
                  </Badge>
                </div>
              </div>
              
              {/* Separator */}
              <div className="w-full h-px bg-border mt-4"></div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Form Fields Section */}
          <div className="mt-6">
            {renderFormFields()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
