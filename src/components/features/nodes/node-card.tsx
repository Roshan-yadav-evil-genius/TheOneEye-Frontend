"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TNodeMetadata } from "@/types";
import { IconPlayerPlay, IconSettings } from "@tabler/icons-react";
import { NodeLogo } from "@/components/common/node-logo";

interface NodeCardProps {
  node: TNodeMetadata;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
}

export function NodeCard({ node, onViewForm, onExecute }: NodeCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <NodeLogo node={node} size="md" />
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base font-semibold">
              {node.label || node.name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-mono">
              {node.identifier}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {node.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {node.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {node.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 pt-2 border-t">
          {node.has_form && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewForm?.(node)}
            >
              <IconSettings className="h-4 w-4 mr-1" />
              Form
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onExecute?.(node)}
          >
            <IconPlayerPlay className="h-4 w-4 mr-1" />
            Execute
          </Button>
        </div>

        {node.category && (
          <div className="mt-3 pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Category: <span className="font-medium">{node.category}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

