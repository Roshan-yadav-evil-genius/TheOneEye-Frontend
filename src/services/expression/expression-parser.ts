/**
 * Expression Parser Interface
 * 
 * Single Responsibility: Abstract interface for parsing expressions from text.
 * Allows different expression engines (Jinja2, JavaScript, etc.) to be used.
 */

export interface ExpressionMatch {
  start: number;
  end: number;
  expression: string;
}

export interface ExpressionParser {
  /**
   * Extract all expressions from text
   */
  extractExpressions(text: string): ExpressionMatch[];

  /**
   * Get expression at a specific position
   */
  getExpressionAtPosition(text: string, position: number): ExpressionMatch | null;

  /**
   * Check if text contains expressions
   */
  hasExpressions(text: string): boolean;

  /**
   * Validate expression syntax
   */
  validate(text: string): { isValid: boolean; error?: string };
}

