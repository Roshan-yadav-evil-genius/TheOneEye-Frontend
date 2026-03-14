import { type Monaco } from "@monaco-editor/react";

export const langIdJinjaText = "jinja-text";

export const registerJinjaTextLanguage = (monaco: Monaco) => {
  if (
    !monaco.languages.getLanguages().some((lang: { id: string }) => lang.id === langIdJinjaText)
  ) {
    monaco.languages.register({ id: langIdJinjaText });
  }

  monaco.languages.setMonarchTokensProvider(langIdJinjaText, {
    tokenizer: {
      root: [
        [/{%/, { token: "keyword.tag-start", next: "@tag" }],
        [/{#/, { token: "comment.tag-start", next: "@comment" }],
        [/{{/, { token: "variable.tag-start", next: "@variable" }],
        [/\s+/, "white"],
        [/./, "text"],
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

  monaco.languages.setLanguageConfiguration(langIdJinjaText, {
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
