import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SITE, fullAddress, telLink, whatsappLink } from '../core/site.config';
import { AnalyticsService } from '../core/analytics.service';

interface Card {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  href: string;
  external?: boolean;
  event?: string;
}

@Component({
  selector: 'app-contact-cards',
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="cards">
      @for (c of cards; track c.label; let i = $index) {
        <li appReveal [revealDelay]="i * 80">
          <a
            class="cc"
            [href]="c.href"
            [attr.target]="c.external ? '_blank' : null"
            [attr.rel]="c.external ? 'noopener' : null"
            (click)="c.event && track(c.event)"
          >
            <span class="cc__icon"><app-icon [name]="c.icon" /></span>
            <span class="cc__arrow"><app-icon name="arrow-up-right" /></span>
            <span class="cc__label">{{ c.label }}</span>
            <span class="cc__value">{{ c.value }}</span>
            @if (c.sub) {
              <span class="cc__sub">{{ c.sub }}</span>
            }
          </a>
        </li>
      }
    </ul>
  `,
  styles: `
    .cards {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr;
      border-top: 1px solid var(--gold-line);
      border-left: 1px solid var(--gold-line);
    }
    @media (min-width: 640px) {
      .cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .cards {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    li {
      border-right: 1px solid var(--gold-line);
      border-bottom: 1px solid var(--gold-line);
    }
    .cc {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 230px;
      padding: 32px 30px;
      text-decoration: none;
      transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out);
    }
    .cc:hover,
    .cc:focus-visible {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .cc:focus-visible {
      outline-offset: -6px;
      outline-color: var(--color-black);
    }
    .cc__icon app-icon {
      width: 34px;
      height: 34px;
    }
    .cc__arrow {
      position: absolute;
      top: 30px;
      right: 28px;
      transition: transform 0.4s var(--ease-out);
    }
    .cc__arrow app-icon {
      width: 18px;
      height: 18px;
    }
    .cc:hover .cc__arrow {
      transform: translate(4px, -4px);
    }
    .cc__label {
      margin-top: auto;
      padding-top: 40px;
      font-size: 11px;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      font-weight: 600;
    }
    .cc__value {
      margin-top: 10px;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }
    .cc__sub {
      margin-top: 4px;
      font-size: 14px;
    }
  `,
})
export class ContactCardsComponent {
  private readonly analytics = inject(AnalyticsService);

  protected readonly cards: Card[] = [
    {
      icon: 'message-circle',
      label: 'WhatsApp',
      value: SITE.phones[0].display,
      sub: 'Fastest way to ask about availability',
      href: whatsappLink(),
      external: true,
      event: 'whatsapp_click',
    },
    ...SITE.phones.map<Card>((p, i) => ({
      icon: 'phone',
      label: i === 0 ? 'Phone' : 'Phone (alternate)',
      value: p.display,
      href: telLink(p),
      event: 'phone_click',
    })),
    {
      icon: 'map-pin',
      label: 'Visit the studio',
      value: fullAddress(),
      href: SITE.directionsUrl,
      external: true,
    },
    {
      icon: 'instagram',
      label: 'Instagram',
      value: SITE.instagram.handle,
      sub: 'Latest looks & bridal work',
      href: SITE.instagram.url,
      external: true,
    },
    {
      icon: 'mail',
      label: 'Email',
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
  ];

  protected track(name: string): void {
    this.analytics.event(name, { location: 'contact_cards' });
  }
}
