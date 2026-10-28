/**
 * Public runtime configuration. Nothing here is secret:
 * - The Apps Script web-app URL is a public endpoint (the Sheet ID and owner email stay in Script Properties).
 * - The GA4 measurement ID is public by design.
 *
 * If the GitHub repository variables APPS_SCRIPT_URL or GA4_ID are set, the deploy workflow
 * replaces the matching value at build time; otherwise the values below are used.
 */
export const environment = {
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbwRDlUH-ekTHTV8q5L1X5UoLQQPQpyTmkcsIOPJfoOBPa4g5Rw95SewAZO6kbxlLYxA/exec',
  ga4Id: '',
};
