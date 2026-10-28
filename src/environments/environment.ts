/**
 * Public runtime configuration. Nothing here is secret:
 * - The Apps Script web-app URL is a public endpoint (the Sheet ID and owner email stay in Script Properties).
 * - The GA4 measurement ID is public by design.
 *
 * The GitHub Actions workflow overwrites these values from repository variables
 * APPS_SCRIPT_URL and GA4_ID at build time, so you normally don't edit this file.
 */
export const environment = {
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwRDlUH-ekTHTV8q5L1X5UoLQQPQpyTmkcsIOPJfoOBPa4g5Rw95SewAZO6kbxlLYxA/exec',
  ga4Id: '',
};
