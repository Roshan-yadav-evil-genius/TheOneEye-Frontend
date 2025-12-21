/**
 * Expression Highlighter Interface
 * 
 * Single Responsibility: Abstract interface for highlighting expressions in text.
 * Allows different highlighting themes and styles.
 */

import { ExpressionMatch } from './expression-parser';
import React from 'react';

export interface HighlightStyle {
  className: string;
}

export interface ExpressionHighlighter {
  /**
   * Render text with highlighted expressions
   */
  renderWithHighlights(
    text: string,
    expressions: ExpressionMatch[]
  ): React.ReactNode;

  /**
   * Get highlight style for expressions
   */
  getHighlightStyle(): HighlightStyle;
}

