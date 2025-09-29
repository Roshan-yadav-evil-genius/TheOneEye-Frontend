// Utility functions for converting between schema paths and expression syntax

export interface FieldData {
  type: 'field';
  key: string;
  path: string;
  fieldType: string;
}

/**
 * Convert a schema field path to expression syntax
 * @param path - The schema field path (e.g., "row_number", "master.c1", "[0].Name")
 * @returns Expression syntax (e.g., "{{ $json[0].row_number }}")
 */
export function convertPathToExpression(path: string): string {
  if (path.startsWith('[')) {
    // Array item path like "[0].Name"
    return `{{ $json${path} }}`;
  } else {
    // Regular field path like "row_number" or "master.c1"
    return `{{ $json[0].${path} }}`;
  }
}

/**
 * Convert expression syntax back to schema field path
 * @param expression - The expression syntax (e.g., "{{ $json[0].row_number }}")
 * @returns Schema field path (e.g., "row_number")
 */
export function convertExpressionToPath(expression: string): string {
  // Remove the expression wrapper and extract the path
  const match = expression.match(/\{\{\s*\$json\[0\]\.(.+?)\s*\}\}/);
  if (match) {
    return match[1];
  }
  
  // Handle array item expressions like {{ $json[0].Name }}
  const arrayMatch = expression.match(/\{\{\s*\$json(\[.+\])\s*\}\}/);
  if (arrayMatch) {
    return arrayMatch[1];
  }
  
  return expression; // Return as-is if no pattern matches
}

/**
 * Check if a string is a valid expression syntax
 * @param text - The text to check
 * @returns True if it's a valid expression
 */
export function isExpression(text: string): boolean {
  return /^\{\{\s*\$json\[0\]\..+?\s*\}\}$/.test(text) || /^\{\{\s*\$json\[.+\]\s*\}\}$/.test(text);
}

/**
 * Extract all expressions from a text string
 * @param text - The text to search
 * @returns Array of found expressions
 */
export function extractExpressions(text: string): string[] {
  const expressionRegex = /\{\{\s*\$json\[0\]\..+?\s*\}\}|\{\{\s*\$json\[.+\]\s*\}\}/g;
  return text.match(expressionRegex) || [];
}

/**
 * Replace expressions in text with their field paths
 * @param text - The text containing expressions
 * @returns Text with expressions replaced by field paths
 */
export function replaceExpressionsWithPaths(text: string): string {
  return text.replace(/\{\{\s*\$json\[0\]\..+?\s*\}\}|\{\{\s*\$json\[.+\]\s*\}\}/g, (match) => {
    return convertExpressionToPath(match);
  });
}

/**
 * Replace field paths in text with expressions
 * @param text - The text containing field paths
 * @returns Text with field paths replaced by expressions
 */
export function replacePathsWithExpressions(text: string): string {
  // This is a simple implementation - in a real app you might want more sophisticated parsing
  return text.replace(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g, (match) => {
    if (isExpression(match)) {
      return match; // Already an expression
    }
    return convertPathToExpression(match);
  });
}
