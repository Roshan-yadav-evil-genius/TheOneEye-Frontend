// Utility functions for converting between schema paths and expression syntax

export interface FieldData {
  type: 'field';
  key: string;
  path: string;
  fieldType: string;
}

/**
 * Convert a schema field path to simplified Jinja2 expression syntax
 * @param path - The schema field path (e.g., "row_number", "master.c1", "[0].Name")
 * @returns Simplified expression syntax (e.g., "{{ row_number }}")
 */
export function convertPathToExpression(path: string): string {
  if (path.startsWith('[')) {
    // Array item path like "[0].Name" - remove the array index
    const cleanPath = path.replace(/^\[\d+\]\.?/, '');
    return `{{ ${cleanPath} }}`;
  } else {
    // Regular field path like "row_number" or "master.c1"
    return `{{ ${path} }}`;
  }
}


/**
 * Check if a string contains Jinja2 template syntax
 * @param text - The text to check
 * @returns True if it contains template syntax
 */
export function isExpression(text: string): boolean {
  return /\{\{.*\}\}/.test(text);
}

/**
 * Extract all Jinja2 expressions from a text string
 * @param text - The text to search
 * @returns Array of found expressions
 */
export function extractExpressions(text: string): string[] {
  const expressionRegex = /\{\{[^}]+\}\}/g;
  return text.match(expressionRegex) || [];
}


/**
 * Validate Jinja2 template syntax
 * @param template - The template string to validate
 * @returns Object with validation result and error message
 */
export function validateTemplate(template: string): { isValid: boolean; error?: string } {
  try {
    // Basic syntax validation
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      return { isValid: false, error: "Mismatched braces in template" };
    }
    
    // Check for unclosed expressions
    const unclosedExpression = /\{\{[^}]*$/;
    if (unclosedExpression.test(template)) {
      return { isValid: false, error: "Unclosed expression" };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Invalid template syntax" };
  }
}

