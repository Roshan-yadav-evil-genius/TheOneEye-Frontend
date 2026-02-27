"use client";

import { useEffect } from "react";
import { useBrowserPoolStore } from "@/stores/browser-pool-store";
import { BrowserPoolPage } from "./BrowserPoolPage";

export function BrowserPoolPageContainer() {
  const { pools, loadPools, isLoading } = useBrowserPoolStore();

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  return <BrowserPoolPage pools={pools} isLoading={isLoading} />;
}
