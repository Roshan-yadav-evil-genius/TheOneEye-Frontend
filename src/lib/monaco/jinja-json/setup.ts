import { type Monaco } from "@monaco-editor/react";
import { registerLanguage } from "./language";
import { registerCompletionProvider } from "./completion";
import { defineTheme } from "./theme";

export const setupJinjaJson = (monaco: Monaco) => {
  registerLanguage(monaco);
  registerCompletionProvider(monaco);
  defineTheme(monaco);
};
