"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { IconPlus, IconKey } from "@tabler/icons-react";
import { CreateOAuth2Dialog } from "./CreateOAuth2Dialog";

interface AuthPageProps {
  // Add props here when needed
}

export function AuthPage({}: AuthPageProps) {
  const [isOAuth2DialogOpen, setIsOAuth2DialogOpen] = useState(false);

  const handleOAuth2Click = () => {
    setIsOAuth2DialogOpen(true);
  };

  const handleBasicAuthClick = () => {
    // TODO: Implement Basic Auth dialog
    console.log("Basic Auth clicked");
  };

  const handleBearerAuthClick = () => {
    // TODO: Implement Bearer Auth dialog
    console.log("Bearer Auth clicked");
  };

  return (
    <div className="space-y-6 mx-4 my-2">
      {/* Header with Create Auth button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Auth</h2>
          <p className="text-muted-foreground">
            Manage authentication configurations
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Create Auth
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleOAuth2Click}>
              <IconKey className="mr-2 h-4 w-4" />
              OAuth2
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconKey className="mr-2 h-4 w-4" />
                Generic Credentials
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={handleBasicAuthClick}>
                  Basic Auth
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBearerAuthClick}>
                  Bearer Auth
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Auth content will be added here */}
      
      {/* OAuth2 Dialog */}
      <CreateOAuth2Dialog
        open={isOAuth2DialogOpen}
        onOpenChange={setIsOAuth2DialogOpen}
      />
    </div>
  );
}

