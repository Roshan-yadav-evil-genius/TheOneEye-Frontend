"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface AlertOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = useCallback((options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlert({
        ...options,
        onConfirm: async () => {
          setIsLoading(true);
          try {
            if (options.onConfirm) {
              await options.onConfirm();
            }
            resolve(true);
          } catch (error) {
            console.error("Alert confirm action failed:", error);
            resolve(false);
          } finally {
            setIsLoading(false);
            setIsOpen(false);
            setAlert(null);
          }
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          resolve(false);
          setIsOpen(false);
          setAlert(null);
        },
      });
      setIsOpen(true);
    });
  }, []);

  const handleCancel = () => {
    if (alert?.onCancel) {
      alert.onCancel();
    }
    setIsOpen(false);
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
            {alert?.description && (
              <AlertDialogDescription>
                {alert.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              {alert?.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={alert?.onConfirm}
              disabled={isLoading}
              className={
                alert?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isLoading ? "Loading..." : alert?.confirmText || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
