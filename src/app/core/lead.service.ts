import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AttributionService } from './attribution.service';

export interface LeadInput {
  name: string;
  whatsapp: string;
  phone: string;
  gender: string;
  ageRange: string;
  service: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  consent: boolean;
  /** honeypot — must stay empty */
  website: string;
}

export type LeadResult =
  | { ok: true; leadId: string; duplicate?: boolean }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const TIMEOUT_MS = 25000;

/**
 * Sends the enquiry to the Google Apps Script web app.
 * Success is reported ONLY when the script confirms the row was saved.
 */
@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly attribution = inject(AttributionService);

  get configured(): boolean {
    return !!environment.appsScriptUrl;
  }

  async submit(input: LeadInput, submissionId: string, formStartedAt: number): Promise<LeadResult> {
    if (!this.configured) {
      return {
        ok: false,
        message:
          'Online enquiries are not connected yet. Please call or WhatsApp us — your details have not been sent.',
      };
    }

    const a = this.attribution.get();
    const payload = {
      ...input,
      submissionId,
      elapsedMs: Date.now() - formStartedAt,
      source: a.source,
      utmSource: a.utmSource,
      utmMedium: a.utmMedium,
      utmCampaign: a.utmCampaign,
      referrer: a.referrer,
      landingPage: a.landingPage,
      page: location.pathname,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      // text/plain avoids a CORS pre-flight, which Apps Script web apps do not answer.
      const res = await fetch(environment.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow',
        signal: controller.signal,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        leadId?: string;
        duplicate?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (data.ok && data.leadId) {
        return { ok: true, leadId: data.leadId, duplicate: data.duplicate };
      }
      return {
        ok: false,
        message: data.error || 'We could not save your enquiry. Please try again.',
        fieldErrors: data.fieldErrors,
      };
    } catch {
      return {
        ok: false,
        message:
          'We could not reach our booking system, so your enquiry was not saved. Please check your connection and try again, or contact us on WhatsApp.',
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Accepts +91 / 91 / 0 prefixes, spaces and dashes; returns 10-digit Indian mobile or null. */
export function normaliseIndianMobile(raw: string): string | null {
  const digits = (raw || '').replace(/[\s\-().]/g, '');
  const m = digits.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  return m ? m[1] : null;
}

export function formatIndianMobile(tenDigits: string): string {
  return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}

export function newSubmissionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
