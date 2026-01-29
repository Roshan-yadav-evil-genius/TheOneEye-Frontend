import { type Monaco } from "@monaco-editor/react";

export const langId = "jinja-json";

export const registerLanguage = (monaco: Monaco) => {
  if (
    !monaco.languages.getLanguages().some((lang: { id: string }) => lang.id === langId)
  ) {
    monaco.languages.register({ id: langId });
  }

  monaco.languages.setMonarchTokensProvider(langId, {
    tokenizer: {
      root: [
        [/{%/, { token: "keyword.tag-start", next: "@tag" }],
        [/{#/, { token: "comment.tag-start", next: "@comment" }],
        [/{{/, { token: "variable.tag-start", next: "@variable" }],
        [/"/, { token: "string.quote", next: "@string" }],
        [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number"],
        [/\b(?:true|false|null)\b/, "keyword.json"],
        [/[{}[\]:,]/, "delimiter"],
        [/\s+/, "white"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, { token: "string.quote", next: "@pop" }],
        [/{%/, { token: "keyword.tag-start", next: "@tag" }],
        [/{#/, { token: "comment.tag-start", next: "@comment" }],
        [/{{/, { token: "variable.tag-start", next: "@variable" }],
      ],
      tag: [
        [/%}/, { token: "keyword.tag-end", next: "@pop" }],
        [/\b(if|else|endif|for|endfor|block|endblock|extends|include|import|macro|endmacro|call|endcall|filter|endfilter|set|endset|raw|endraw)\b/, "keyword"],
        [/"[^"]*"/, "string"],
        [/'[^']*'/, "string"],
        [/\d+/, "number"],
        [/\s+/, "white"],
        [/[a-zA-Z_]\w*/, "identifier"],
      ],
      variable: [
        [/}}/, { token: "variable.tag-end", next: "@pop" }],
        [/"[^"]*"/, "string"],
        [/'[^']*'/, "string"],
        [/\d+/, "number"],
        [/\s+/, "white"],
        [/[a-zA-Z_]\w*/, "identifier"],
        [/[()\[\]]/, "delimiter"],
      ],
      comment: [
        [/#}/, { token: "comment.tag-end", next: "@pop" }],
        [/./, "comment"],
      ],
    },
  });

  monaco.languages.setLanguageConfiguration(langId, {
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "{%", close: "%}" },
      { open: "{{", close: "}}" },
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    brackets: [
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
    ],
  });
};
