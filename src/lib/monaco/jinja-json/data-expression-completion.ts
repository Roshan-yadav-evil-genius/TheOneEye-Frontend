/**
 * Monaco completions for Jinja paths rooted at `data` inside `{{ }}` or iterable in `{% for … in … %}`,
 * using node INPUT JSON.
 */

import type { editor, IPosition, languages } from "monaco-editor";
import type { Monaco } from "@monaco-editor/react";
import { jinja2Parser } from "@/services/expression/jinja2-parser";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function expandSegmentSteps(segment: string): Array<string | number> | null {
  if (segment.length === 0) return [];

  const steps: Array<string | number> = [];
  let i = 0;

  if (segment[i] !== "[") {
    let key = "";
    while (i < segment.length && segment[i] !== "[") {
      key += segment[i];
      i += 1;
    }
    if (key.length === 0) return null;
    steps.push(key);
  }

  while (i < segment.length) {
    if (segment[i] !== "[") return null;
    i += 1;

    let digits = "";
    while (i < segment.length && segment[i] >= "0" && segment[i] <= "9") {
      digits += segment[i];
      i += 1;
    }
    if (digits.length === 0) return null;
    if (i >= segment.length || segment[i] !== "]") return null;
    i += 1;

    steps.push(Number(digits));
  }

  return steps;
}

type ParseResult =
  | { kind: "keyword"; keywordText: string; replaceStartOffset: number; replaceEndOffset: number }
  | { kind: "keys"; segments: string[]; partial: string; replaceStartOffset: number; replaceEndOffset: number };

/** Re-export for callers that still import from this module. */
export { shouldSuppressGenericJinjaCompletions } from "./data-path-context";

function parseDataPathAfterInner(
  fullText: string,
  innerStartOffset: number,
  cursorOffset: number
): ParseResult | null {
  const raw = fullText.slice(innerStartOffset, cursorOffset);
  const pathPart = raw.split("|")[0];
  const leadMatch = pathPart.match(/^\s*/);
  const lead = leadMatch ? leadMatch[0].length : 0;
  const t = pathPart.slice(lead).trimEnd();
  const tStartOffset = innerStartOffset + lead;

  if (t.length === 0) {
    return {
      kind: "keyword",
      keywordText: "",
      replaceStartOffset: cursorOffset,
      replaceEndOffset: cursorOffset,
    };
  }

  if (t.length < 4 && "data".startsWith(t)) {
    return {
      kind: "keyword",
      keywordText: t,
      replaceStartOffset: tStartOffset,
      replaceEndOffset: tStartOffset + t.length,
    };
  }

  if (t === "data") {
    return null;
  }

  if (!t.startsWith("data")) {
    return null;
  }

  if (!t.startsWith("data.")) {
    return null;
  }

  const pathAfterData = t.slice(5);
  const parts = pathAfterData.split(".");
  let segments: string[];
  let partial: string;

  if (pathAfterData.endsWith(".")) {
    segments = parts.slice(0, -1).filter((p) => p.length > 0);
    partial = "";
  } else {
    segments = parts.slice(0, -1);
    partial = parts[parts.length - 1] ?? "";
  }

  const replaceStartOffset = partial.length === 0 ? cursorOffset : cursorOffset - partial.length;
  const replaceEndOffset = cursorOffset;

  return {
    kind: "keys",
    segments,
    partial,
    replaceStartOffset,
    replaceEndOffset,
  };
}

function resolveObjectAtSegments(
  root: Record<string, unknown>,
  segments: string[]
): Record<string, unknown> | null {
  let current: unknown = root;
  for (const seg of segments) {
    const steps = expandSegmentSteps(seg);
    if (!steps) return null;

    for (const step of steps) {
      if (typeof step === "string") {
        if (!isPlainObject(current)) return null;
        if (!Object.prototype.hasOwnProperty.call(current, step)) return null;
        current = current[step];
      } else {
        if (!Array.isArray(current)) return null;
        if (step < 0 || step >= current.length) return null;
        current = current[step];
      }
    }
  }
  if (!isPlainObject(current)) return null;
  return current;
}

export function provideDataExpressionCompletions(
  monaco: Monaco,
  model: editor.ITextModel,
  position: IPosition,
  inputData: Record<string, unknown>
): { suggestions: languages.CompletionItem[] } | undefined {
  const offset = model.getOffsetAt(position);
  const fullText = model.getValue();
  const ctx = jinja2Parser.getDataPathExpressionStartAtPosition(fullText, offset);
  if (!ctx) return undefined;

  const parsed = parseDataPathAfterInner(fullText, ctx.innerStartOffset, offset);
  if (!parsed) return undefined;

  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: 1,
    endColumn: 1,
  };

  const setRange = (startOff: number, endOff: number) => {
    const startPos = model.getPositionAt(startOff);
    const endPos = model.getPositionAt(endOff);
    range.startLineNumber = startPos.lineNumber;
    range.startColumn = startPos.column;
    range.endLineNumber = endPos.lineNumber;
    range.endColumn = endPos.column;
  };

  const suggestions: languages.CompletionItem[] = [];

  if (parsed.kind === "keyword") {
    setRange(parsed.replaceStartOffset, parsed.replaceEndOffset);
    if (parsed.keywordText.length === 0 || "data".startsWith(parsed.keywordText)) {
      suggestions.push({
        label: "data",
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: "data",
        range,
        detail: "Input root",
      });
    }
    return suggestions.length > 0 ? { suggestions } : undefined;
  }

  setRange(parsed.replaceStartOffset, parsed.replaceEndOffset);
  const obj = resolveObjectAtSegments(inputData, parsed.segments);
  if (!obj) return undefined;

  const p = parsed.partial.toLowerCase();
  const keys = Object.keys(obj).filter((k) => p === "" || k.toLowerCase().startsWith(p));

  keys.forEach((key, index) => {
    suggestions.push({
      label: key,
      kind: monaco.languages.CompletionItemKind.Property,
      insertText: key,
      range,
      detail: "Input field",
      // Monaco sorts by label unless sortText is set; preserve INPUT object key order.
      sortText: String(index).padStart(6, "0"),
    });
  });

  return suggestions.length > 0 ? { suggestions } : undefined;
}
