// Browser session constants

export const BROWSER_TYPES = [
  { value: 'chromium', label: 'Chromium' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'webkit', label: 'WebKit' },
] as const;

export const BROWSER_INFO = {
  chromium: {
    description: "Chromium-based browsers including Chrome, Edge, and Playwright's bundled Chromium.",
    args_reference_url: "https://peter.sh/experiments/chromium-command-line-switches/"
  },
  firefox: {
    description: "Mozilla Firefox (Playwright Firefox uses a custom engine but supports a subset of these flags).",
    args_reference_url: "https://developer.mozilla.org/en-US/docs/Mozilla/Command_Line_Options"
  },
  webkit: {
    description: "WebKit (Playwright WebKit has very limited support for args).",
    args_reference_url: "https://trac.webkit.org/wiki/WebKitGTK/Debugging"
  }
} as const;

