import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../shared/icon.component';
import { SITE, primaryPhone, telLink, whatsappLink } from '../core/site.config';
import { AnalyticsService } from '../core/analytics.service';

export const NAV = [
  { path: '/', label: 'Home', exact: true },
  { path: '/services', label: 'Services', exact: false },
  { path: '/bridal-studio', label: 'Bridal Studio', exact: false },
  { path: '/gallery', label: 'Gallery', exact: false },
  { path: '/about', label: 'About', exact: false },
  { path: '/contact', label: 'Contact', exact: false },
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hdr" [class.hdr--solid]="scrolled() || open()">
      <div class="hdr__inner container">
        <a routerLink="/" class="brand" aria-label="HAUTE LOOKS — home" (click)="close()">
          <span class="brand__name">HAUTE LOOKS</span>
          <span class="brand__sub">Unisex Salon &amp; Bridal Studio</span>
        </a>

        <nav class="nav" aria-label="Primary">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="is-active"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              >{{ item.label }}</a
            >
          }
        </nav>

        <div class="hdr__actions">
          <a class="hdr__call" [href]="tel" (click)="track('phone_click')" aria-label="Call {{ phone.display }}">
            <app-icon name="phone" />
          </a>
          <a class="btn hdr__cta" [href]="wa" target="_blank" rel="noopener" (click)="track('whatsapp_click')">
            Book Now
          </a>
          <button
            class="burger"
            type="button"
            (click)="toggle()"
            [attr.aria-expanded]="open()"
            aria-controls="mobile-menu"
            [attr.aria-label]="open() ? 'Close menu' : 'Open menu'"
          >
            <app-icon [name]="open() ? 'x' : 'menu'" />
          </button>
        </div>
      </div>
    </header>

    <div id="mobile-menu" class="drawer" [class.is-open]="open()" [attr.aria-hidden]="!open()" [attr.inert]="open() ? null : ''">
      <nav class="drawer__nav" aria-label="Mobile">
        @for (item of nav; track item.path; let i = $index) {
          <a
            [routerLink]="item.path"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            [style.--i]="i"
            (click)="close()"
            ><span class="drawer__num">0{{ i + 1 }}</span>{{ item.label }}</a
          >
        }
      </nav>
      <div class="drawer__foot">
        <a class="btn btn--block" [href]="wa" target="_blank" rel="noopener" (click)="track('whatsapp_click')">
          <app-icon name="message-circle" /> Book on WhatsApp
        </a>
        <p class="micro">{{ hours }}</p>
      </div>
    </div>
  `,
  styles: `
    .hdr {
      position: fixed;
      inset: 0 0 auto;
      z-index: 100;
      height: var(--header-h);
      transition: background 0.5s var(--ease-out), border-color 0.5s;
      border-bottom: 1px solid transparent;
    }
    .hdr--solid {
      background: var(--color-black);
      border-color: var(--gold-line);
    }
    .hdr__inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }
    .brand {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      line-height: 1;
      position: relative;
      z-index: 2;
    }
    .brand__name {
      font-family: var(--font-display);
      font-size: clamp(22px, 2.2vw, 28px);
      font-weight: 600;
      letter-spacing: 0.2em;
    }
    .brand__sub {
      margin-top: 6px;
      font-size: 9px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      font-weight: 600;
    }
    .nav {
      display: none;
      gap: clamp(18px, 2.2vw, 36px);
    }
    .nav a {
      position: relative;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 8px 0;
    }
    .nav a::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s var(--ease-cinema);
    }
    .nav a:hover::after,
    .nav a.is-active::after {
      transform: scaleX(1);
      transform-origin: left;
    }
    .hdr__actions {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      z-index: 2;
    }
    .hdr__call,
    .burger {
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      border: 1px solid var(--gold-line);
      border-radius: 50%;
      background: transparent;
      color: var(--color-gold);
      cursor: pointer;
      transition: background 0.3s, color 0.3s;
    }
    .hdr__call:hover,
    .burger:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .hdr__call app-icon,
    .burger app-icon {
      width: 18px;
      height: 18px;
    }
    .hdr__cta {
      display: none;
      min-height: 44px;
      padding: 10px 22px;
      font-size: 12px;
    }
    @media (min-width: 1080px) {
      .nav,
      .hdr__cta {
        display: flex;
      }
      .burger {
        display: none;
      }
    }

    .drawer {
      position: fixed;
      inset: 0;
      z-index: 90;
      background: var(--color-black);
      padding: calc(var(--header-h) + 24px) var(--gutter) 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      clip-path: inset(0 0 100% 0);
      transition: clip-path 0.8s var(--ease-cinema);
      overflow-y: auto;
    }
    .drawer.is-open {
      clip-path: inset(0 0 0 0);
    }
    .drawer__nav {
      display: flex;
      flex-direction: column;
    }
    .drawer__nav a {
      display: flex;
      align-items: baseline;
      gap: 18px;
      padding: 14px 0;
      border-bottom: 1px solid var(--gold-line);
      font-family: var(--font-display);
      font-size: clamp(2rem, 9vw, 3rem);
      text-decoration: none;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
      transition-delay: calc(0.25s + var(--i) * 0.06s);
    }
    .drawer.is-open .drawer__nav a {
      opacity: 1;
      transform: none;
    }
    .drawer__nav a.is-active {
      font-style: italic;
    }
    .drawer__num {
      font-family: var(--font-body);
      font-size: 12px;
      letter-spacing: 0.2em;
    }
    .drawer__foot {
      display: grid;
      gap: 16px;
      margin-top: 32px;
      text-align: center;
    }
    @media (min-width: 1080px) {
      .drawer {
        display: none;
      }
    }
  `,
})
export class HeaderComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly analytics = inject(AnalyticsService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly nav = NAV;
  protected readonly phone = primaryPhone();
  protected readonly tel = telLink(this.phone);
  protected readonly wa = whatsappLink();
  protected readonly hours = `${SITE.hours.label} · ${SITE.hours.display}`;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);

  constructor() {
    const router = inject(Router);
    const sub = router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.close());
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());

    if (this.isBrowser) {
      const onScroll = () => this.scrolled.set(window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.close();
      window.addEventListener('keydown', onKey);
      inject(DestroyRef).onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('keydown', onKey);
      });
    }
  }

  protected toggle(): void {
    this.open.update((v) => !v);
    this.doc.body.classList.toggle('no-scroll', this.open());
  }

  protected close(): void {
    this.open.set(false);
    this.doc.body.classList.remove('no-scroll');
  }

  protected track(name: string): void {
    this.analytics.event(name, { location: 'header' });
  }
}
