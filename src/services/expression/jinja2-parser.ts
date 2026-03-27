/**
 * Jinja2 Expression Parser
 * 
 * Single Responsibility: Parses Jinja2 template expressions ({{ }}).
 */

import { ExpressionParser, ExpressionMatch } from './expression-parser';

/**
 * Global offset where the `data…` path expression starts for completion:
 * after `{{`, or after `in` in `{% for x in … %}`.
 */
export interface JinjaVariableInnerContext {
  innerStartOffset: number;
}

export class Jinja2ExpressionParser implements ExpressionParser {
  private readonly expressionRegex = /\{\{[^}]+\}\}/g;

  extractExpressions(text: string): ExpressionMatch[] {
    const expressions: ExpressionMatch[] = [];
    const regex = new RegExp(this.expressionRegex.source, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      expressions.push({
        start: match.index,
        end: match.index + match[0].length,
        expression: match[0],
      });
    }

    return expressions;
  }

  getExpressionAtPosition(text: string, position: number): ExpressionMatch | null {
    const expressions = this.extractExpressions(text);
    return expressions.find((expr) => position >= expr.start && position <= expr.end) || null;
  }

  /**
   * Returns the inner start offset of the `{{ ... }}` variable span containing `offset`.
   * Uses the last `{{` before the cursor and the next `}}` after it (document-wide, multi-line).
   * Does not model nested `{{` inside outer expressions.
   */
  getVariableInnerContextAtPosition(text: string, offset: number): JinjaVariableInnerContext | null {
    if (offset < 0 || offset > text.length) return null;

    const before = text.slice(0, offset);
    const openIdx = before.lastIndexOf("{{");
    if (openIdx === -1) return null;

    const innerStart = openIdx + 2;
    if (offset < innerStart) return null;

    const closeIdx = text.indexOf("}}", innerStart);
    if (closeIdx === -1) {
      return { innerStartOffset: innerStart };
    }
    // Include offset === closeIdx so `{{data.}}` works: with no space before `}}`, the caret
    // after `.` often sits on the same index as the first `}`; slice(innerStart, offset) still omits `}`.
    if (offset >= innerStart && offset <= closeIdx) {
      return { innerStartOffset: innerStart };
    }
    return null;
  }

  /**
   * `{% for name in <iterable> %}` — returns the offset where the iterable expression starts
   * (e.g. `data` in `for item in data.api`), when the cursor is inside that tag before `%}`.
   */
  private getForInIterableExpressionStartAtPosition(
    text: string,
    offset: number
  ): JinjaVariableInnerContext | null {
    if (offset < 0 || offset > text.length) return null;

    const before = text.slice(0, offset);
    const tagOpen = before.lastIndexOf("{%");
    if (tagOpen === -1) return null;

    const afterTagOpen = tagOpen + 2;
    if (offset < afterTagOpen) return null;

    const tagClose = text.indexOf("%}", afterTagOpen);
    const innerEnd = tagClose === -1 ? text.length : tagClose;
    if (offset > innerEnd) return null;

    const innerBeforeCursor = text.slice(afterTagOpen, offset);
    const re = /\bfor\s+\w+\s+in\s+/i;
    const m = innerBeforeCursor.match(re);
    if (!m || m.index === undefined) return null;

    const pathStart = afterTagOpen + m.index + m[0].length;
    if (offset < pathStart) return null;

    return { innerStartOffset: pathStart };
  }

  /**
   * Start of the `data…` path for completion: inside `{{ … }}` or iterable in `{% for … in … %}`.
   */
  getDataPathExpressionStartAtPosition(
    text: string,
    offset: number
  ): JinjaVariableInnerContext | null {
    return (
      this.getVariableInnerContextAtPosition(text, offset) ??
      this.getForInIterableExpressionStartAtPosition(text, offset)
    );
  }

  hasExpressions(text: string): boolean {
    return this.expressionRegex.test(text);
  }

  validate(text: string): { isValid: boolean; error?: string } {
    try {
      // Basic syntax validation
      const openBraces = (text.match(/\{\{/g) || []).length;
      const closeBraces = (text.match(/\}\}/g) || []).length;

      if (openBraces !== closeBraces) {
        return { isValid: false, error: 'Mismatched braces in template' };
      }

      // Check for unclosed expressions
      const unclosedExpression = /\{\{[^}]*$/;
      if (unclosedExpression.test(text)) {
        return { isValid: false, error: 'Unclosed expression' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Invalid template syntax' };
    }
  }
}

// Export singleton instance
export const jinja2Parser = new Jinja2ExpressionParser();

