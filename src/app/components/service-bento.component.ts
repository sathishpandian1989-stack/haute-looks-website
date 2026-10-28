import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { RevealDirective } from '../shared/reveal.directive';
import { FEATURED } from '../core/content';
import { serviceEnquiry } from '../core/site.config';
import { AnalyticsService } from '../core/analytics.service';

/** Editorial bento grid of signature services; every card opens a WhatsApp enquiry. */
@Component({
  selector: 'app-service-bento',
  imports: [IconComponent, PictureComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bento">
      @for (s of services; track s.id; let i = $index) {
        <a
          class="card card--{{ s.layout }}"
          [class.card--text]="!s.image"
          [href]="link(s.enquiry)"
          target="_blank"
          rel="noopener"
          appReveal
          [revealDelay]="i * 90"
          (click)="track(s.enquiry)"
          [attr.aria-label]="s.title + ' ' + s.titleAccent + ' — enquire on WhatsApp'"
        >
          @if (s.image) {
            <div class="card__media"><app-picture [img]="s.image" sizes="(min-width: 1024px) 60vw, 100vw" /></div>
          }
          <span class="card__num">/ {{ s.id }}</span>
          <span class="card__arrow"><app-icon name="arrow-up-right" /></span>
          <div class="card__body">
            @if (!s.image) {
              <span class="icon-ring"><app-icon [name]="s.icon" /></span>
            }
            <h3>{{ s.title }} <span class="italic">{{ s.titleAccent }}</span></h3>
            <p>{{ s.text }}</p>
            <span class="card__cta">Enquire on WhatsApp</span>
          </div>
          <span class="card__corner" aria-hidden="true"></span>
        </a>
      }
    </div>
  `,
  styles: `
    .bento {
      display: grid;
      gap: 14px;
      grid-template-columns: 1fr;
    }
    @media (min-width: 720px) {
      .bento {
        grid-template-columns: repeat(2, 1fr);
      }
      .card--feature,
      .card--wide {
        grid-column: span 2;
      }
    }
    @media (min-width: 1024px) {
      .bento {
        grid-template-columns: repeat(12, 1fr);
        grid-auto-rows: minmax(250px, 22vw);
        grid-auto-rows: clamp(250px, 22vw, 320px);
      }
      .card--feature {
        grid-column: 1 / 8;
        grid-row: 1 / 3;
      }
      .card--tall {
        grid-column: 8 / 13;
        grid-row: 1 / 2;
      }
      .card--small {
        grid-column: 8 / 13;
        grid-row: 2 / 3;
      }
      .card--text {
        grid-column: 1 / 6;
        grid-row: 3 / 5;
      }
      .card--wide {
        grid-column: 6 / 13;
        grid-row: 3 / 5;
      }
    }

    .card {
      position: relative;
      display: flex;
      align-items: flex-end;
      min-height: 380px;
      padding: clamp(22px, 2.6vw, 36px);
      overflow: hidden;
      text-decoration: none;
      border: 1px solid var(--gold-line);
      isolation: isolate;
    }
    @media (min-width: 1024px) {
      .card {
        min-height: 0;
      }
    }
    .card__media {
      position: absolute;
      inset: 0;
      z-index: -1;
    }
    .card__media ::ng-deep img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.4s var(--ease-out);
    }
    .card--wide .card__media ::ng-deep img {
      object-position: center 25%;
    }
    .card__media::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(23, 23, 23, 0.92) 0%, rgba(23, 23, 23, 0.25) 55%, rgba(23, 23, 23, 0.1) 100%);
    }
    .card:hover .card__media ::ng-deep img,
    .card:focus-visible .card__media ::ng-deep img {
      transform: scale(1.05);
    }
    .card__num {
      position: absolute;
      top: clamp(20px, 2.4vw, 32px);
      left: clamp(22px, 2.6vw, 36px);
      font-size: 12px;
      letter-spacing: 0.2em;
      font-weight: 600;
    }
    .card__arrow {
      position: absolute;
      top: clamp(16px, 2vw, 26px);
      right: clamp(16px, 2vw, 26px);
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--gold-line);
      border-radius: 50%;
      transition: background 0.4s, color 0.4s, transform 0.5s var(--ease-out);
    }
    .card__arrow app-icon {
      width: 16px;
      height: 16px;
    }
    .card:hover .card__arrow {
      background: var(--color-gold);
      color: var(--color-black);
      transform: rotate(45deg);
    }
    .card__corner {
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-top: 1px solid var(--color-gold);
      border-right: 1px solid var(--color-gold);
      transition: width 0.6s var(--ease-cinema), height 0.6s var(--ease-cinema);
    }
    .card:hover .card__corner {
      width: 72px;
      height: 72px;
    }
    .card__body {
      max-width: 46ch;
    }
    .card h3 {
      font-size: clamp(2rem, 3.4vw, 3rem);
      margin-bottom: 12px;
    }
    .card--feature h3,
    .card--wide h3 {
      font-size: clamp(2.3rem, 4.4vw, 3.8rem);
    }
    .card p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 14px;
    }
    .card__cta {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      border-bottom: 1px solid currentColor;
      padding-bottom: 4px;
    }
    .card--text {
      align-items: stretch;
      background: var(--color-black);
    }
    .card--text .card__body {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 0;
    }
    .card--text .icon-ring {
      margin-bottom: auto;
      margin-top: 48px;
    }
    .card--text:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .card--text:hover .card__arrow {
      background: var(--color-black);
      color: var(--color-gold);
    }
    .card--text:hover .icon-ring {
      border-color: var(--color-black);
    }
    .card--text {
      transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out);
    }
  `,
})
export class ServiceBentoComponent {
  private readonly analytics = inject(AnalyticsService);
  protected readonly services = FEATURED;
  protected readonly link = serviceEnquiry;

  protected track(service: string): void {
    this.analytics.event('whatsapp_click', { location: 'service_card', service });
  }
}
