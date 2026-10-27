/**
 * HAUTE LOOKS — website enquiry backend (Google Apps Script web app)
 *
 * Flow: website POST → validate → de-duplicate → append row (under lock) → respond success
 *       → THEN email the owner (failure is logged in the sheet, never loses the lead).
 *
 * Setup (see README "Google Sheets & Apps Script"):
 *   1. Create a Google Sheet → Extensions → Apps Script → paste this file (and appsscript.json).
 *   2. Project Settings → Script Properties:
 *        OWNER_EMAIL     = address that receives new-lead emails (required)
 *        SPREADSHEET_ID  = optional; defaults to the sheet this script is bound to
 *        SHEET_NAME      = optional; defaults to "Leads"
 *   3. Run setup() once from the editor and approve the permissions.
 *   4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → copy the /exec URL.
 */

var DEFAULT_SHEET = 'Leads';
var TZ = 'Asia/Kolkata';

var HEADERS = [
  'Lead ID', 'Submitted At (IST)', 'Name', 'WhatsApp', 'Phone', 'Gender', 'Age Range', 'Service',
  'Preferred Date', 'Preferred Time', 'Email', 'Message', 'Consent', 'Source', 'UTM Source',
  'UTM Medium', 'UTM Campaign', 'Referrer', 'Landing Page', 'Form Page', 'Status', 'Follow-up Notes',
  'Notification Status', 'Submission ID'
];
var COL = {};
HEADERS.forEach(function (h, i) { COL[h] = i + 1; });

var SERVICES = [
  'Haircut & Styling', "Men's Haircut & Beard Grooming", 'Hair Colour', 'Hair Smoothening / Treatment',
  'Skin Care', 'Occasion Makeup', 'Bridal Makeup & Hair Package', 'Other / Not sure yet'
];
var GENDERS = ['', 'Female', 'Male', 'Other', 'Prefer not to say'];
var AGES = ['', 'Under 18', '18–24', '25–34', '35–44', '45–54', '55+', 'Prefer not to say'];
var TIMES = ['', 'Morning (8:30 – 12)', 'Afternoon (12 – 4)', 'Evening (4 – 9)', 'Any time'];
var STATUSES = ['New', 'Contacted', 'Booked', 'Closed', 'Spam'];

var MIN_FILL_MS = 3000;          // faster than this = bot
var RATE_LIMIT = 3;              // max enquiries per number…
var RATE_WINDOW_S = 600;         // …per 10 minutes

/* ------------------------------------------------------------------ */
/* HTTP handlers                                                       */
/* ------------------------------------------------------------------ */

function doGet() {
  return json_({ ok: true, service: 'haute-looks-leads' });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'Invalid request.' });
  }

  // --- spam safeguards -------------------------------------------------
  if (str_(body.website)) {
    console.warn('Honeypot triggered');
    return json_({ ok: false, error: 'Your enquiry could not be accepted. Please contact us on WhatsApp.' });
  }
  if (Number(body.elapsedMs) > 0 && Number(body.elapsedMs) < MIN_FILL_MS) {
    return json_({ ok: false, error: 'That was a little quick — please check your details and try again.' });
  }

  // --- validation --------------------------------------------------------
  var v = validate_(body);
  if (v.errors) {
    return json_({ ok: false, error: 'Please correct the highlighted fields.', fieldErrors: v.errors });
  }
  var lead = v.lead;

  var submissionId = str_(body.submissionId).slice(0, 64);
  if (!/^[A-Za-z0-9-]{8,64}$/.test(submissionId)) {
    return json_({ ok: false, error: 'Invalid request. Please refresh the page and try again.' });
  }

  var cache = CacheService.getScriptCache();
  var lock = LockService.getScriptLock();
  var leadId, rowIndex, sheet;

  try {
    lock.waitLock(15000);
  } catch (err) {
    return json_({ ok: false, error: 'We are receiving many enquiries right now. Please try again in a moment.' });
  }

  try {
    sheet = getSheet_();

    // --- idempotency: same submission ID → return the original lead -----
    var existing = cache.get('sub_' + submissionId) || findBySubmissionId_(sheet, submissionId);
    if (existing) {
      return json_({ ok: true, leadId: existing, duplicate: true });
    }

    // --- rate limit per WhatsApp number ---------------------------------
    var rlKey = 'rl_' + lead.whatsapp;
    var count = Number(cache.get(rlKey) || 0);
    if (count >= RATE_LIMIT) {
      return json_({ ok: false, error: 'We have already received several enquiries from this number. Our team will contact you soon, or message us on WhatsApp.' });
    }

    leadId = newLeadId_();
    var now = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss');
    var row = [
      leadId, now, lead.name, lead.whatsapp, lead.phone, lead.gender, lead.ageRange, lead.service,
      lead.preferredDate, lead.preferredTime, lead.email, lead.message, 'Yes',
      clip_(body.source, 100), clip_(body.utmSource, 100), clip_(body.utmMedium, 100),
      clip_(body.utmCampaign, 100), clip_(body.referrer, 200), clip_(body.landingPage, 200),
      clip_(body.page, 200), 'New', '', 'Pending', submissionId
    ].map(safeCell_);

    sheet.appendRow(row);
    SpreadsheetApp.flush();
    rowIndex = sheet.getLastRow();

    cache.put('sub_' + submissionId, leadId, 21600);
    cache.put(rlKey, String(count + 1), RATE_WINDOW_S);
  } catch (err) {
    console.error('Lead storage failed: ' + (err && err.message));
    return json_({ ok: false, error: 'We could not save your enquiry. Please try again, or contact us on WhatsApp.' });
  } finally {
    lock.releaseLock();
  }

  // --- storage succeeded: notify owner (never affects the response) --------
  notify_(sheet, rowIndex, leadId, lead);
  console.log('Lead stored: ' + leadId);
  return json_({ ok: true, leadId: leadId });
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validate_(b) {
  var errors = {};
  var name = str_(b.name).replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 80 || !/^[\p{L} .'-]+$/u.test(name)) errors.name = 'Please enter a valid name.';

  var wa = normaliseMobile_(b.whatsapp);
  if (!wa) errors.whatsapp = 'Enter a valid 10-digit Indian mobile number.';

  var phone = '';
  if (str_(b.phone)) {
    phone = normaliseMobile_(b.phone);
    if (!phone) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  var service = str_(b.service);
  if (SERVICES.indexOf(service) < 0) errors.service = 'Please choose a service.';

  var email = str_(b.email).slice(0, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email address.';

  var date = str_(b.preferredDate);
  if (date) {
    var today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
    // allow one day of slack for visitors in other time zones
    var yesterday = Utilities.formatDate(new Date(Date.now() - 86400000), TZ, 'yyyy-MM-dd');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < yesterday) errors.preferredDate = 'Please choose today or a future date.';
  }

  var time = str_(b.preferredTime);
  if (TIMES.indexOf(time) < 0) time = '';
  var gender = str_(b.gender);
  if (GENDERS.indexOf(gender) < 0) gender = '';
  var age = str_(b.ageRange);
  if (AGES.indexOf(age) < 0) age = '';

  var message = str_(b.message);
  if (message.length > 1000) errors.message = 'Please keep your message under 1000 characters.';

  if (b.consent !== true) errors.consent = 'Consent is required so we can contact you.';

  if (Object.keys(errors).length) return { errors: errors };
  return {
    lead: {
      name: name, whatsapp: wa, phone: phone, service: service, email: email, preferredDate: date,
      preferredTime: time, gender: gender, ageRange: age, message: message
    }
  };
}

/** Returns "+91XXXXXXXXXX" or '' — only strips formatting/prefix, never alters digits. */
function normaliseMobile_(raw) {
  var d = str_(raw).replace(/[\s\-().]/g, '');
  var m = d.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  return m ? '+91' + m[1] : '';
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

function notify_(sheet, rowIndex, leadId, lead) {
  var status;
  try {
    var to = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
    if (!to) throw new Error('OWNER_EMAIL script property not set');
    var url = sheet.getParent().getUrl() + '#gid=' + sheet.getSheetId() + '&range=A' + rowIndex;
    var when = Utilities.formatDate(new Date(), TZ, 'dd MMM yyyy, h:mm a');
    var waLink = 'https://wa.me/' + lead.whatsapp.replace('+', '');
    var lines = [
      'New website enquiry for HAUTE LOOKS',
      '',
      'Lead ID: ' + leadId,
      'Name: ' + lead.name,
      'WhatsApp: ' + lead.whatsapp + '  (' + waLink + ')',
      lead.phone ? 'Phone: ' + lead.phone : null,
      'Service: ' + lead.service,
      lead.preferredDate ? 'Preferred: ' + lead.preferredDate + ' ' + lead.preferredTime : null,
      'Received: ' + when + ' IST',
      '',
      'Open in the sheet (restricted): ' + url
    ].filter(function (l) { return l !== null; });
    MailApp.sendEmail({
      to: to,
      subject: 'New enquiry ' + leadId + ' — ' + lead.service,
      body: lines.join('\n'),
      name: 'HAUTE LOOKS Website'
    });
    status = 'Sent ' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm');
  } catch (err) {
    status = 'FAILED: ' + String(err && err.message).slice(0, 120);
    console.error('Notification failed for ' + leadId + ': ' + (err && err.message));
  }
  try {
    sheet.getRange(rowIndex, COL['Notification Status']).setValue(status);
  } catch (err) {
    console.error('Could not record notification status for ' + leadId);
  }
}

/** Owner-side retry: menu "HAUTE LOOKS → Retry failed notifications". */
function retryFailedNotifications() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return;
  var data = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  var retried = 0;
  data.forEach(function (r, i) {
    var st = String(r[COL['Notification Status'] - 1]);
    if (st.indexOf('FAILED') === 0 || st === 'Pending') {
      notify_(sheet, i + 2, r[0], {
        name: r[2], whatsapp: String(r[3]), phone: String(r[4]), service: r[7],
        preferredDate: String(r[8]), preferredTime: r[9]
      });
      retried++;
    }
  });
  try { SpreadsheetApp.getUi().alert('Retried ' + retried + ' notification(s).'); } catch (e) { /* run from editor */ }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('HAUTE LOOKS')
    .addItem('Retry failed notifications', 'retryFailedNotifications')
    .addItem('Send test notification', 'testNotification')
    .addToUi();
}

function testNotification() {
  var to = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  MailApp.sendEmail(to, 'HAUTE LOOKS — test notification', 'Email notifications are working.');
}

/* ------------------------------------------------------------------ */
/* Sheet helpers                                                       */
/* ------------------------------------------------------------------ */

/** Run once from the editor: creates the Leads sheet, headers, status dropdown and formatting. */
function setup() {
  var sheet = getSheet_();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#171717').setFontColor('#D4AF37');
  sheet.setFrozenRows(1);
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
  sheet.getRange(2, COL['Status'], sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  sheet.autoResizeColumns(1, HEADERS.length);
  sheet.hideColumns(COL['Submission ID']);
  if (!PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL')) {
    console.warn('Remember to set the OWNER_EMAIL script property.');
  }
}

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet: bind the script to a sheet or set SPREADSHEET_ID');
  var name = props.getProperty('SHEET_NAME') || DEFAULT_SHEET;
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function findBySubmissionId_(sheet, submissionId) {
  var last = sheet.getLastRow();
  if (last < 2) return '';
  var hit = sheet.getRange(2, COL['Submission ID'], last - 1, 1)
    .createTextFinder(submissionId).matchEntireCell(true).findNext();
  return hit ? String(sheet.getRange(hit.getRow(), 1).getValue()) : '';
}

function newLeadId_() {
  var d = Utilities.formatDate(new Date(), TZ, 'yyMMdd');
  var rand = Utilities.getUuid().replace(/-/g, '').slice(0, 5).toUpperCase();
  return 'HL-' + d + '-' + rand;
}

/* ------------------------------------------------------------------ */
/* Utils                                                               */
/* ------------------------------------------------------------------ */

function str_(v) {
  return v === undefined || v === null ? '' : String(v).trim();
}

function clip_(v, n) {
  return str_(v).slice(0, n);
}

/** Prevents spreadsheet formula injection (=, +, -, @ at the start of a cell). */
function safeCell_(v) {
  var s = String(v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
