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

// Default browser args for automation
export const DEFAULT_BROWSER_ARGS = [
  '--disable-blink-features=AutomationControlled',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding'
] as const;

// Default user agents for each browser type
export const DEFAULT_USER_AGENTS = {
  chromium: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.3',
  firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.',
  webkit: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.3'
} as const;

