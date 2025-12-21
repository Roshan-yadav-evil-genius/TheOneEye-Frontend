/**
 * Default Expression Highlighter
 * 
 * Single Responsibility: Provides default highlighting for expressions.
 */

import { ExpressionHighlighter, HighlightStyle } from './expression-highlighter';
import { ExpressionMatch } from './expression-parser';
import React from 'react';

export class DefaultExpressionHighlighter implements ExpressionHighlighter {
  private readonly style: HighlightStyle = {
    className: 'bg-green-500/20 text-green-300 px-1 py-0.5 rounded font-mono',
  };

  renderWithHighlights(text: string, expressions: ExpressionMatch[]): React.ReactNode {
    if (!text) return null;

    if (expressions.length === 0) {
      return <span>{text}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    expressions.forEach((expr, idx) => {
      // Add text before expression
      if (expr.start > lastIndex) {
        parts.push(<span key={`text-${idx}`}>{text.slice(lastIndex, expr.start)}</span>);
      }

      // Add highlighted expression
      parts.push(
        <span key={`expr-${idx}`} className={this.style.className}>
          {expr.expression}
        </span>
      );

      lastIndex = expr.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
  }

  getHighlightStyle(): HighlightStyle {
    return this.style;
  }
}

// Export singleton instance
export const defaultHighlighter = new DefaultExpressionHighlighter();

