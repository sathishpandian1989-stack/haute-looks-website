import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { primaryPhone, telLink, whatsappLink } from '../core/site.config';
import { AnalyticsService } from '../core/analytics.service';

@Component({
  selector: 'app-cta-band',
  imports: [IconComponent, RevealDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta section--gold on-gold" aria-labelledby="cta-h">
      <div class="container cta__inner">
        <div>
          <p class="eyebrow">{{ eyebrow() }}</p>
          <h2 id="cta-h" class="display-2" appReveal>{{ heading() }}</h2>
        </div>
        <div class="cta__side" appReveal [revealDelay]="150">
          <p>{{ text() }}</p>
          <div class="cta__actions">
            <a class="btn btn--dark" [href]="wa" target="_blank" rel="noopener" (click)="track('whatsapp_click')">
              <app-icon name="message-circle" /> Book on WhatsApp
            </a>
            <a class="btn btn--dark cta__ghost" [href]="tel" (click)="track('phone_click')">
              <app-icon name="phone" /> Call {{ phone.display }}
            </a>
          </div>
          <a class="link-underline" routerLink="/contact" fragment="enquiry">Or send an enquiry <app-icon name="arrow-up-right" /></a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta {
      padding-block: clamp(64px, 9vw, 120px);
      position: relative;
      overflow: hidden;
    }
    .cta__inner {
      display: grid;
      gap: 32px;
    }
    @media (min-width: 900px) {
      .cta__inner {
        grid-template-columns: 1.2fr 1fr;
        gap: 72px;
        align-items: end;
      }
    }
    .cta__side p {
      font-size: 1.05rem;
      max-width: 48ch;
    }
    .cta__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 8px 0 28px;
    }
    .cta__ghost {
      --btn-bg: transparent;
      --btn-fg: var(--color-black);
    }
    .cta__ghost::before {
      background: var(--color-black);
    }
    .cta__ghost:hover:not(:disabled) {
      color: var(--color-gold);
    }
  `,
})
export class CtaBandComponent {
  readonly eyebrow = input('Book your visit');
  readonly heading = input('Let’s create your signature look.');
  readonly text = input(
    'Tell us what you have in mind. Call or WhatsApp HAUTE LOOKS to ask about services, prices and appointment availability.',
  );

  private readonly analytics = inject(AnalyticsService);
  protected readonly phone = primaryPhone();
  protected readonly wa = whatsappLink();
  protected readonly tel = telLink(this.phone);

  protected track(name: string): void {
    this.analytics.event(name, { location: 'cta_band' });
  }
}
