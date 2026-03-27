import type { editor, IPosition } from "monaco-editor";
import { jinja2Parser } from "@/services/expression/jinja2-parser";

/**
 * True when the cursor is in a `data…` path inside `{{ }}` or `{% for … in … %}` where INPUT key
 * completions apply; generic Jinja snippets/filters should be hidden.
 */
export function shouldSuppressGenericJinjaCompletions(
  model: editor.ITextModel,
  position: IPosition
): boolean {
  const offset = model.getOffsetAt(position);
  const fullText = model.getValue();
  const ctx = jinja2Parser.getDataPathExpressionStartAtPosition(fullText, offset);
  if (!ctx) return false;

  const raw = fullText.slice(ctx.innerStartOffset, offset);
  const pathPart = raw.split("|")[0];
  const leadMatch = pathPart.match(/^\s*/);
  const lead = leadMatch ? leadMatch[0].length : 0;
  const t = pathPart.slice(lead).trimEnd();

  if (t.length === 0) return true;
  if (t.length < 4 && "data".startsWith(t)) return true;
  if (t === "data") return true;
  if (t.startsWith("data.")) return true;
  return false;
}
