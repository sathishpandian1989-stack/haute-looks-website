import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

type ConsentState = 'granted' | 'denied' | 'unset';
const CONSENT_KEY = 'hl_analytics_consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 wrapper. Loads nothing unless a measurement ID is configured AND the visitor
 * has accepted analytics. Conversion events: phone_click, whatsapp_click,
 * form_start, generate_lead.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private loaded = false;

  readonly enabled = !!environment.ga4Id;
  readonly consent = signal<ConsentState>('unset');

  init(): void {
    if (!this.isBrowser || !this.enabled) return;
    const stored = safeGet(CONSENT_KEY) as ConsentState | null;
    this.consent.set(stored ?? 'unset');
    if (stored === 'granted') this.load();
  }

  setConsent(granted: boolean): void {
    this.consent.set(granted ? 'granted' : 'denied');
    safeSet(CONSENT_KEY, granted ? 'granted' : 'denied');
    if (granted) this.load();
  }

  pageView(path: string): void {
    this.event('page_view', { page_path: path, page_location: this.doc.location?.href });
  }

  event(name: string, params: Record<string, unknown> = {}): void {
    if (!this.loaded || !window.gtag) return;
    window.gtag('event', name, params);
  }

  private load(): void {
    if (this.loaded || !this.isBrowser) return;
    this.loaded = true;
    const id = environment.ga4Id;
    const script = this.doc.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    this.doc.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true, send_page_view: false });
    this.pageView(this.doc.location.pathname);
  }
}

export function safeGet(key: string, store: 'local' | 'session' = 'local'): string | null {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string, store: 'local' | 'session' = 'local'): void {
  try {
    (store === 'local' ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}
