import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { primaryPhone, telLink, whatsappLink } from '../core/site.config';
import { AnalyticsService } from '../core/analytics.service';

/**
 * WhatsApp floating button (desktop/tablet) + sticky Call / WhatsApp bar (mobile).
 */
@Component({
  selector: 'app-quick-contact',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="fab" [href]="wa" target="_blank" rel="noopener" aria-label="Chat with HAUTE LOOKS on WhatsApp" (click)="track('whatsapp_click')">
      <app-icon name="message-circle" />
      <span class="fab__label">WhatsApp</span>
    </a>

    <div class="bar" role="group" aria-label="Quick contact">
      <a class="bar__btn" [href]="tel" (click)="track('phone_click')"><app-icon name="phone" /> Call</a>
      <a class="bar__btn bar__btn--gold" [href]="wa" target="_blank" rel="noopener" (click)="track('whatsapp_click')">
        <app-icon name="message-circle" /> WhatsApp
      </a>
    </div>
  `,
  styles: `
    .fab {
      position: fixed;
      right: 28px;
      bottom: 28px;
      z-index: 80;
      display: none;
      align-items: center;
      gap: 0;
      height: 60px;
      padding: 0 19px;
      border-radius: 30px;
      background: var(--color-gold);
      color: var(--color-black);
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      border: 1px solid var(--color-black);
      transition: gap 0.4s var(--ease-out), transform 0.4s var(--ease-out);
      animation: fab-in 0.8s var(--ease-out) 2.6s both;
    }
    .fab app-icon {
      width: 22px;
      height: 22px;
    }
    .fab__label {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      transition: max-width 0.5s var(--ease-out);
    }
    .fab:hover,
    .fab:focus-visible {
      gap: 10px;
      transform: translateY(-3px);
    }
    .fab:hover .fab__label,
    .fab:focus-visible .fab__label {
      max-width: 120px;
    }
    .fab:focus-visible {
      outline-color: var(--color-gold);
    }
    @keyframes fab-in {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
    }

    .bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 80;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding-bottom: env(safe-area-inset-bottom);
      background: var(--color-black);
      border-top: 1px solid var(--gold-line);
    }
    .bar__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 58px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .bar__btn app-icon {
      width: 18px;
      height: 18px;
    }
    .bar__btn--gold {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .bar__btn--gold:focus-visible {
      outline-color: var(--color-black);
      outline-offset: -4px;
    }
    @media (min-width: 1080px) {
      .fab {
        display: inline-flex;
      }
      .bar {
        display: none;
      }
    }
  `,
})
export class QuickContactComponent {
  private readonly analytics = inject(AnalyticsService);
  protected readonly wa = whatsappLink();
  protected readonly tel = telLink(primaryPhone());

  protected track(name: string): void {
    this.analytics.event(name, { location: 'quick_contact' });
  }
}
