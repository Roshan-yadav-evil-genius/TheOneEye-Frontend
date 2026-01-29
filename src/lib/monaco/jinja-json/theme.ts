import { type Monaco } from "@monaco-editor/react";

export const themeName = "jinja-dark";

export const defineTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme(themeName, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword.tag-start", foreground: "C586C0", fontStyle: "bold" },
      { token: "keyword.tag-end", foreground: "C586C0", fontStyle: "bold" },
      { token: "keyword", foreground: "569CD6" },
      { token: "keyword.json", foreground: "569CD6" },
      { token: "comment.tag-start", foreground: "6A9955" },
      { token: "comment.tag-end", foreground: "6A9955" },
      { token: "comment", foreground: "6A9955" },
      { token: "variable.tag-start", foreground: "DCDCAA" },
      { token: "variable.tag-end", foreground: "DCDCAA" },
      { token: "variable", foreground: "9CDCFE" },
      { token: "string", foreground: "CE9178" },
      { token: "string.quote", foreground: "CE9178" },
      { token: "string.escape", foreground: "D7BA7D" },
      { token: "number", foreground: "B5CEA8" },
      { token: "delimiter", foreground: "D4D4D4" },
      { token: "identifier", foreground: "DCDCAA" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
    },
  });
};
