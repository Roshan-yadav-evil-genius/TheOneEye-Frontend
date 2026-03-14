import { type Monaco } from "@monaco-editor/react";
import { registerLanguage } from "./language";
import { defineTheme } from "./theme";

export const setupJinjaJson = (monaco: Monaco) => {
  registerLanguage(monaco);
  defineTheme(monaco);
};
