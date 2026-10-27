import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/** Coordinates the opening wordmark reveal with the hero entrance animation. */
@Injectable({ providedIn: 'root' })
export class IntroService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** true once the hero is allowed to animate in */
  readonly done = signal(false);
  /** whether the preloader should play on this page load */
  readonly shouldPlay = signal(false);

  init(): void {
    if (!this.isBrowser) return;
    const html = this.doc.documentElement;
    const skip = html.classList.contains('intro-seen') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (skip) {
      this.done.set(true);
    } else {
      this.shouldPlay.set(true);
    }
  }

  finish(): void {
    this.done.set(true);
    try {
      sessionStorage.setItem('hl_intro', '1');
    } catch {
      /* ignore */
    }
  }
}
