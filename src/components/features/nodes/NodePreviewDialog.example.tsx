/**
 * Example usage of NodePreviewDialog component
 * This demonstrates how the component can be used anywhere in the application
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { NodePreviewDialog } from "./NodePreviewDialog";
import { BackendNodeType } from "@/types/api/backend";

// Example: Using NodePreviewDialog in a custom component
export function ExampleNodePreviewButton() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Example node data - this could come from props, API, or state
  const exampleNodeData: Partial<BackendNodeType> = {
    name: "Example Node",
    type: "action",
    description: "This is an example node for demonstration",
    version: "1.0.0",
    tags: ["example", "demo"],
    form_configuration: {
      fields: [
        {
          id: "example-field",
          type: "text",
          label: "Example Field",
          required: true
        }
      ]
    }
  };

  const exampleLogoPreview = null; // Could be a base64 string or URL

  return (
    <div>
      <Button 
        onClick={() => setIsPreviewOpen(true)}
        variant="outline"
      >
        Preview Example Node
      </Button>
      
      <NodePreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        nodeData={exampleNodeData}
        logoPreview={exampleLogoPreview}
      />
    </div>
  );
}

/**
 * Usage in any component:
 * 
 * 1. Import the component:
 *    import { NodePreviewDialog } from "@/components/features/nodes";
 * 
 * 2. Add state for dialog control:
 *    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
 * 
 * 3. Add a button to trigger the preview:
 *    <Button onClick={() => setIsPreviewOpen(true)}>Preview</Button>
 * 
 * 4. Add the dialog component:
 *    <NodePreviewDialog
 *      isOpen={isPreviewOpen}
 *      onOpenChange={setIsPreviewOpen}
 *      nodeData={yourNodeData}
 *      logoPreview={yourLogoPreview}
 *    />
 * 
 * That's it! The component is simple and explicit about state management.
 * This approach is more understandable and follows React patterns.
 */
