import { type Monaco } from "@monaco-editor/react";
import { registerLanguage } from "./language";
import { registerJinjaTextLanguage } from "./jinja-text-language";
import { defineTheme } from "./theme";

export const setupJinjaJson = (monaco: Monaco) => {
  registerLanguage(monaco);
  registerJinjaTextLanguage(monaco);
  defineTheme(monaco);
};
