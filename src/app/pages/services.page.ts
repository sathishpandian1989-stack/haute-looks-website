import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { RevealDirective } from '../shared/reveal.directive';
import { ParallaxDirective } from '../shared/parallax.directive';
import { CtaBandComponent } from '../components/cta-band.component';
import { MarqueeComponent } from '../components/marquee.component';
import { CATEGORIES, IMAGES } from '../core/content';
import { serviceEnquiry } from '../core/site.config';
import { AnalyticsService } from '../core/analytics.service';

@Component({
  selector: 'app-services',
  imports: [RouterLink, IconComponent, PictureComponent, RevealDirective, ParallaxDirective, CtaBandComponent, MarqueeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero" aria-labelledby="page-h">
      <div class="page-hero__media"><app-picture [img]="hero" [eager]="true" sizes="100vw" [decorative]="true" /></div>
      <div class="container">
        <p class="eyebrow">Services · Karaikudi</p>
        <h1 id="page-h" class="display-1" appReveal>Hair, skin <span class="italic">&amp;</span> makeup</h1>
        <p class="lead" appReveal [revealDelay]="150">
          Every service starts with a short consultation about your style, your occasion and your comfort. Prices are shared on
          enquiry so you know what to expect before you book.
        </p>
        <nav class="jump" aria-label="Service categories" appReveal [revealDelay]="250">
          @for (c of categories; track c.id) {
            <a routerLink="/services" [fragment]="c.id"><app-icon [name]="c.icon" /> {{ c.label }}</a>
          }
        </nav>
      </div>
    </section>

    @for (c of categories; track c.id; let odd = $odd) {
      <section class="section section--rule cat" [class.cat--flip]="odd" [id]="c.id" [attr.aria-labelledby]="'h-' + c.id">
        <div class="container cat__grid">
          <div class="cat__media" [class.cat__media--text]="!c.image" appReveal="mask">
            @if (c.image) {
              <div class="cat__img" appParallax="0.06"><app-picture [img]="c.image" sizes="(min-width: 1024px) 45vw, 100vw" /></div>
            } @else {
              <div class="cat__emblem">
                <app-icon [name]="c.icon" [stroke]="1" />
                <span class="micro">Ask for the current menu</span>
              </div>
            }
            <span class="cat__label micro">{{ c.label }}</span>
          </div>
          <div>
            <p class="eyebrow">{{ c.label }}</p>
            <h2 [id]="'h-' + c.id" class="display-2" appReveal>{{ c.title }}</h2>
            <p class="lead cat__intro" appReveal [revealDelay]="100">{{ c.intro }}</p>
            <ul class="items">
              @for (it of c.items; track it.name; let i = $index) {
                <li appReveal [revealDelay]="i * 70">
                  <div>
                    <h3>{{ it.name }}</h3>
                    <p>{{ it.text }}</p>
                  </div>
                  <a class="items__cta" [href]="enquire(it.name)" target="_blank" rel="noopener" (click)="track(it.name)">
                    <span>Enquire on WhatsApp</span>
                    <app-icon name="arrow-up-right" />
                  </a>
                </li>
              }
            </ul>
            <p class="price-note"><app-icon name="message-square" /> Price on enquiry · depends on hair length, products and requirements</p>
          </div>
        </div>
      </section>
    }

    <app-marquee [gold]="true" [words]="['Consult', 'Create', 'Confidence', 'Signature looks']" />
    <app-cta-band heading="Not sure which service is right?" eyebrow="Free to ask" />
  `,
  styles: `
    .jump {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 36px;
    }
    .jump a {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 44px;
      padding: 10px 18px;
      border: 1px solid var(--gold-line);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      text-decoration: none;
      transition: background 0.3s, color 0.3s;
    }
    .jump a:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .jump app-icon {
      width: 16px;
      height: 16px;
    }
    .cat__grid {
      display: grid;
      gap: 48px;
      align-items: start;
    }
    @media (min-width: 1024px) {
      .cat__grid {
        grid-template-columns: 0.9fr 1.1fr;
        gap: 88px;
      }
      .cat--flip .cat__media {
        order: 2;
      }
      .cat__media {
        position: sticky;
        top: calc(var(--header-h) + 32px);
      }
    }
    .cat__media {
      position: relative;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      border: 1px solid var(--gold-line);
    }
    .cat__img {
      position: absolute;
      inset: -6% 0;
    }
    .cat__img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 25%;
    }
    .cat__media--text {
      display: grid;
      place-items: center;
    }
    .cat__emblem {
      display: grid;
      justify-items: center;
      gap: 24px;
      text-align: center;
    }
    .cat__emblem app-icon {
      width: 120px;
      height: 120px;
    }
    .cat__label {
      position: absolute;
      left: 20px;
      bottom: 20px;
      padding: 8px 14px;
      background: var(--color-black);
      border: 1px solid var(--gold-line);
    }
    .cat__intro {
      margin: 24px 0 36px;
    }
    .items {
      list-style: none;
      margin: 0;
      padding: 0;
      border-top: 1px solid var(--gold-line);
    }
    .items li {
      display: grid;
      gap: 14px;
      padding: 26px 0;
      border-bottom: 1px solid var(--gold-line);
    }
    @media (min-width: 640px) {
      .items li {
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 32px;
      }
    }
    .items h3 {
      font-size: 1.7rem;
      margin-bottom: 6px;
    }
    .items p {
      margin: 0;
      font-size: 15px;
    }
    .items__cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      justify-self: start;
      min-height: 44px;
      padding: 10px 16px;
      border: 1px solid var(--gold-line);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.3s, color 0.3s;
    }
    .items__cta app-icon {
      width: 14px;
      height: 14px;
    }
    .items__cta:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .price-note {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 22px;
      font-size: 13px;
    }
    .price-note app-icon {
      width: 16px;
      height: 16px;
      flex: none;
    }
  `,
})
export class ServicesPage {
  private readonly analytics = inject(AnalyticsService);
  protected readonly hero = IMAGES.colour;
  protected readonly categories = CATEGORIES;
  protected readonly enquire = serviceEnquiry;

  protected track(service: string): void {
    this.analytics.event('whatsapp_click', { location: 'services_page', service });
  }
}
