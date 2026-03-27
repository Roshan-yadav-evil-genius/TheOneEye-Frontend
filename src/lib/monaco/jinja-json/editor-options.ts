import type { editor } from "monaco-editor";

/**
 * Defaults for JSON + Jinja template fields (mixed content; avoid JSON format-on-type).
 */
export function getFormTemplateMonacoOptions(): editor.IStandaloneEditorConstructionOptions {
  return {
    readOnly: false,
    lineNumbers: "on",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    lineHeight: 20,
    padding: { top: 10, bottom: 10 },
    wordWrap: "on",
    formatOnPaste: false,
    formatOnType: false,
    autoClosingOvertype: "never",
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    tabSize: 2,
    insertSpaces: true,
  };
}
