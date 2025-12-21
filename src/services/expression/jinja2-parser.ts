/**
 * Jinja2 Expression Parser
 * 
 * Single Responsibility: Parses Jinja2 template expressions ({{ }}).
 */

import { ExpressionParser, ExpressionMatch } from './expression-parser';

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

