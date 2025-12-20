// Browser session constants

export const BROWSER_TYPES = [
  { value: 'chromium', label: 'Chromium' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'webkit', label: 'WebKit' },
] as const;

export const BROWSER_INFO = {
  chromium: {
    description: "Chromium-based browsers including Chrome, Edge, and Playwright's bundled Chromium.",
  },
  firefox: {
    description: "Mozilla Firefox (Playwright Firefox uses a custom engine).",
  },
  webkit: {
    description: "WebKit (Safari's engine).",
  }
} as const;
