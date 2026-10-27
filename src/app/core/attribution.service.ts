import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { safeGet, safeSet } from './analytics.service';

export interface Attribution {
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
  landingPage: string;
}

const KEY = 'hl_attribution';

/**
 * Captures first-touch UTM parameters and referrer for the browsing session.
 * The traffic source is only classified from evidence (UTM or referrer);
 * when neither exists it is recorded as "Direct / unknown" rather than guessed.
 */
@Injectable({ providedIn: 'root' })
export class AttributionService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  capture(): void {
    if (!this.isBrowser || safeGet(KEY, 'session')) return;
    const params = new URLSearchParams(this.doc.location.search);
    const referrer = this.externalReferrer();
    const data: Attribution = {
      utmSource: (params.get('utm_source') ?? '').slice(0, 100),
      utmMedium: (params.get('utm_medium') ?? '').slice(0, 100),
      utmCampaign: (params.get('utm_campaign') ?? '').slice(0, 100),
      referrer,
      landingPage: this.doc.location.pathname,
      source: '',
    };
    data.source = classify(data.utmSource, referrer, params.has('gclid'), params.has('fbclid'));
    safeSet(KEY, JSON.stringify(data), 'session');
  }

  get(): Attribution {
    const raw = safeGet(KEY, 'session');
    if (raw) {
      try {
        return JSON.parse(raw) as Attribution;
      } catch {
        /* fall through */
      }
    }
    return { source: 'Direct / unknown', utmSource: '', utmMedium: '', utmCampaign: '', referrer: '', landingPage: '' };
  }

  private externalReferrer(): string {
    const ref = this.doc.referrer;
    if (!ref) return '';
    try {
      const host = new URL(ref).hostname;
      return host === this.doc.location.hostname ? '' : host;
    } catch {
      return '';
    }
  }
}

function classify(utmSource: string, refHost: string, gclid: boolean, fbclid: boolean): string {
  const s = `${utmSource} ${refHost}`.toLowerCase();
  if (gclid) return 'Google Ads';
  if (/instagram|ig\b/.test(s)) return 'Instagram';
  if (fbclid || /facebook|fb\.com|\bfb\b/.test(s)) return 'Facebook';
  if (/google/.test(s)) return 'Google';
  if (/whatsapp|wa\.me/.test(s)) return 'WhatsApp';
  if (utmSource) return utmSource;
  if (refHost) return `Referral (${refHost})`;
  return 'Direct / unknown';
}
