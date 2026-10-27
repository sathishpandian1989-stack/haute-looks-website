/**
 * Public runtime configuration. Nothing here is secret:
 * - The Apps Script web-app URL is a public endpoint (the Sheet ID and owner email stay in Script Properties).
 * - The GA4 measurement ID is public by design.
 *
 * The GitHub Actions workflow overwrites these values from repository variables
 * APPS_SCRIPT_URL and GA4_ID at build time, so you normally don't edit this file.
 */
export const environment = {
  appsScriptUrl: '',
  ga4Id: '',
};
