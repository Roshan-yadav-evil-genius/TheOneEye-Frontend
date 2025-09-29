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

