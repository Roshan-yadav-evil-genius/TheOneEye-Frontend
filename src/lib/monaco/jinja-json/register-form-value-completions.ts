import { type Monaco } from "@monaco-editor/react";
import type { editor, IPosition, languages } from "monaco-editor";
import { registerCompletionProvider } from "./completion";
import { shouldSuppressGenericJinjaCompletions } from "./data-path-context";
import { provideDataExpressionCompletions } from "./data-expression-completion";
import { langId } from "./language";
import { langIdJinjaText } from "./jinja-text-language";

export type FormValueCompletionConfig = {
  jsonMode: boolean;
  availableVariables: string[];
  workflowEnvKeys: string[];
  /** When defined (including `{}`), INPUT `data.*` completions are registered. */
  getNodeInputData: () => Record<string, unknown> | undefined;
};

/**
 * Registers all Monaco completion providers for the form template editor (built-in Jinja, optional
 * JSON-mode workflow/env/keywords, optional INPUT `data.*`). Returns a single disposable.
 */
export function registerFormValueInputCompletions(
  monaco: Monaco,
  config: FormValueCompletionConfig
): { dispose: () => void } {
  const disposables: { dispose: () => void }[] = [];

  const builtinLang = config.jsonMode ? langId : langIdJinjaText;
  disposables.push(registerCompletionProvider(monaco, builtinLang));

  if (config.jsonMode) {
    disposables.push(
      monaco.languages.registerCompletionItemProvider(langId, {
        provideCompletionItems: (
          model: editor.ITextModel,
          position: IPosition
        ) => {
          if (shouldSuppressGenericJinjaCompletions(model, position)) {
            return { suggestions: [] };
          }

          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions: languages.CompletionItem[] = [];

          config.availableVariables.forEach((variable) => {
            suggestions.push({
              label: variable,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: variable,
              range,
              detail: "Workflow variable",
            });
          });

          config.workflowEnvKeys.forEach((key) => {
            const label = `workflowenv.${key}`;
            suggestions.push({
              label,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: `{{ ${label} }}`,
              range,
              detail: "Workflow env variable",
            });
          });

          const jsonKeywords = [
            { label: "true", kind: monaco.languages.CompletionItemKind.Keyword },
            { label: "false", kind: monaco.languages.CompletionItemKind.Keyword },
            { label: "null", kind: monaco.languages.CompletionItemKind.Keyword },
          ];

          jsonKeywords.forEach(({ label, kind }) => {
            suggestions.push({
              label,
              kind,
              insertText: label,
              range,
            });
          });

          return { suggestions };
        },
      })
    );
  }

  const data = config.getNodeInputData();
  if (data !== undefined) {
    const runCompletion = (model: editor.ITextModel, position: IPosition) => {
      const current = config.getNodeInputData();
      if (!current) return { suggestions: [] as languages.CompletionItem[] };
      return (
        provideDataExpressionCompletions(monaco, model, position, current) ?? {
          suggestions: [] as languages.CompletionItem[],
        }
      );
    };

    const providerOpts = {
      triggerCharacters: [".", "{", "|"],
      provideCompletionItems: runCompletion,
    };
    disposables.push(
      monaco.languages.registerCompletionItemProvider(langId, providerOpts),
      monaco.languages.registerCompletionItemProvider(langIdJinjaText, providerOpts)
    );
  }

  return {
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}
