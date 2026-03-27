/**
 * Default Expression Highlighter
 *
 * Single Responsibility: Provides default highlighting for expressions.
 */

import { ExpressionHighlighter, HighlightStyle } from "./expression-highlighter";
import { ExpressionMatch } from "./expression-parser";
import React from "react";

export class DefaultExpressionHighlighter implements ExpressionHighlighter {
  private readonly style: HighlightStyle = {
    className: "rounded bg-primary/15 px-1 py-0.5 font-mono text-primary",
  };

  renderWithHighlights(text: string, expressions: ExpressionMatch[]): React.ReactNode {
    if (!text) return null;

    if (expressions.length === 0) {
      return <span>{text}</span>;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    expressions.forEach((expr, idx) => {
      if (expr.start > lastIndex) {
        parts.push(<span key={`text-${idx}`}>{text.slice(lastIndex, expr.start)}</span>);
      }

      parts.push(
        <span key={`expr-${idx}`} className={this.style.className}>
          {expr.expression}
        </span>
      );

      lastIndex = expr.end;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
  }

  getHighlightStyle(): HighlightStyle {
    return this.style;
  }
}

export const defaultHighlighter = new DefaultExpressionHighlighter();
