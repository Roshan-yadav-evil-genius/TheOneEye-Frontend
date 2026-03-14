/**
 * Utilities for redirect-after-login: building login URL with return path
 * and validating redirect param to prevent open redirects.
 */

const REDIRECT_PARAM = 'redirect';

/**
 * Returns a path if the redirect param is safe (same-origin path only).
 * Prevents open redirects by allowing only paths that start with / but not //.
 */
export function getSafeRedirectTarget(redirectParam: string | null): string | null {
  if (!redirectParam || typeof redirectParam !== 'string') return null;
  const trimmed = redirectParam.trim();
  if (trimmed.startsWith('//') || !trimmed.startsWith('/')) return null;
  return trimmed;
}

/**
 * Builds /login URL with optional redirect query param.
 * @param returnTo - Full path + search (e.g. pathname + search) to return to after login.
 */
export function buildLoginUrlWithRedirect(returnTo?: string): string {
  const base = '/login';
  if (!returnTo || !returnTo.startsWith('/')) return base;
  const encoded = encodeURIComponent(returnTo);
  return `${base}?${REDIRECT_PARAM}=${encoded}`;
}

export { REDIRECT_PARAM };
