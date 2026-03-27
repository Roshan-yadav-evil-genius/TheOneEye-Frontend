import { useEffect, useRef, type RefObject } from "react";
import type { editor } from "monaco-editor";
import {
  registerFormValueInputCompletions,
  type FormValueCompletionConfig,
} from "@/lib/monaco/jinja-json";

type MonacoNamespace = typeof import("monaco-editor");

export type UseMonacoFormValueCompletionsParams = {
  /** When false, no completion registration (e.g. plain text input instead of Monaco). */
  enabled: boolean;
  editorRef: RefObject<editor.IStandaloneCodeEditor | null>;
  /** Bump after editor mounts so registration runs when editor is ready. */
  editorMountEpoch: number;
  jsonMode: boolean;
  availableVariables: string[];
  workflowEnvKeys: string[];
  /** When true (including `{}`), INPUT `data.*` providers are registered. */
  hasNodeInputData: boolean;
  getNodeInputData: () => Record<string, unknown> | undefined;
};

/**
 * Registers all Monaco completion providers for the Jinja template form field; disposes on change or unmount.
 */
export function useMonacoFormValueCompletions({
  enabled,
  editorRef,
  editorMountEpoch,
  jsonMode,
  availableVariables,
  workflowEnvKeys,
  hasNodeInputData,
  getNodeInputData,
}: UseMonacoFormValueCompletionsParams): void {
  const getNodeInputDataRef = useRef(getNodeInputData);
  getNodeInputDataRef.current = getNodeInputData;

  useEffect(() => {
    if (!enabled) return;
    if (!editorRef.current) return;

    const monaco = (window as Window & { monaco?: MonacoNamespace }).monaco;
    if (!monaco) return;

    const config: FormValueCompletionConfig = {
      jsonMode,
      availableVariables,
      workflowEnvKeys,
      getNodeInputData: () => getNodeInputDataRef.current(),
    };

    const registration = registerFormValueInputCompletions(monaco, config);
    return () => registration.dispose();
  }, [
    enabled,
    editorMountEpoch,
    jsonMode,
    availableVariables,
    workflowEnvKeys,
    editorRef,
    hasNodeInputData,
  ]);
}
