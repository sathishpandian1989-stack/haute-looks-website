import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { RevealDirective } from '../shared/reveal.directive';
import { ParallaxDirective } from '../shared/parallax.directive';
import { CtaBandComponent } from '../components/cta-band.component';
import { MarqueeComponent } from '../components/marquee.component';
import { IMAGES, PROMISES } from '../core/content';
import { SITE, fullAddress } from '../core/site.config';

@Component({
  selector: 'app-about',
  imports: [IconComponent, PictureComponent, RevealDirective, ParallaxDirective, CtaBandComponent, MarqueeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero" aria-labelledby="page-h">
      <div class="page-hero__media"><app-picture [img]="images.smoothening" [eager]="true" sizes="100vw" [decorative]="true" /></div>
      <div class="container">
        <p class="eyebrow">The people behind the look</p>
        <h1 id="page-h" class="display-1" appReveal>A personal approach to <span class="italic">every look.</span></h1>
      </div>
    </section>

    <section class="section" aria-labelledby="story-h">
      <div class="container story">
        <figure class="story__media" appReveal="mask">
          <div class="story__img" appParallax="0.06"><app-picture [img]="images.team" sizes="(min-width: 1024px) 40vw, 100vw" /></div>
          <span class="story__frame" aria-hidden="true"></span>
          <figcaption>
            @if (leader.name) {
              <span class="story__name">{{ leader.name }}</span>
            }
            <span class="micro">{{ leader.role }}</span>
          </figcaption>
        </figure>
        <div>
          <p class="eyebrow">Our story</p>
          <h2 id="story-h" class="display-2" appReveal>Listening comes <span class="italic">first</span></h2>
          <div class="story__copy" appReveal [revealDelay]="120">
            <p class="lead">
              At HAUTE LOOKS, our focus is helping every guest feel comfortable, understood and confident in their look. From
              everyday hair care to special-occasion styling, we begin by listening to what you want and discussing the
              service that suits your needs.
            </p>
            <p>
              We are a unisex salon and bridal studio in {{ site.city }}, offering hair, skin and makeup services for women and
              men — and bridal looks planned around each bride’s day. Our promise is simple: {{ site.tagline.toLowerCase() }},
              with honest advice and clear pricing before you book.
            </p>
          </div>
        </div>
      </div>
    </section>

    <app-marquee [words]="['Listen', 'Advise', 'Create', 'Care']" />

    <section class="section" aria-labelledby="values-h">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">What we stand for</p>
            <h2 id="values-h" class="display-2" appReveal>Comfort, clarity <span class="italic">&amp; confidence</span></h2>
          </div>
        </div>
        <ul class="values">
          @for (p of promises; track p.title; let i = $index) {
            <li appReveal [revealDelay]="i * 100">
              <span class="values__n">0{{ i + 1 }}</span>
              <span class="icon-ring"><app-icon [name]="p.icon" /></span>
              <h3>{{ p.title }}</h3>
              <p>{{ p.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="section section--rule" aria-labelledby="visit-h">
      <div class="container visit">
        <div>
          <p class="eyebrow">Visit us</p>
          <h2 id="visit-h" class="display-2" appReveal>Find us in <span class="italic">Karaikudi</span></h2>
        </div>
        <dl class="visit__list" appReveal [revealDelay]="120">
          <div>
            <dt class="micro"><app-icon name="map-pin" /> Address</dt>
            <dd>{{ address }}</dd>
          </div>
          <div>
            <dt class="micro"><app-icon name="clock" /> Hours</dt>
            <dd>{{ site.hours.label }} · {{ site.hours.display }}</dd>
          </div>
          <div>
            <dt class="micro"><app-icon name="navigation" /> Directions</dt>
            <dd><a [href]="site.directionsUrl" target="_blank" rel="noopener">Open in Google Maps</a></dd>
          </div>
        </dl>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: `
    .story {
      display: grid;
      gap: 56px;
      align-items: center;
    }
    @media (min-width: 1024px) {
      .story {
        grid-template-columns: 0.9fr 1.1fr;
        gap: 96px;
      }
    }
    .story__media {
      position: relative;
      margin: 0;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      max-width: 540px;
    }
    .story__img {
      position: absolute;
      inset: -6% 0;
    }
    .story__img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .story__frame {
      position: absolute;
      inset: 16px;
      border: 1px solid var(--gold-line);
    }
    .story__media figcaption {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
      display: grid;
      gap: 4px;
      padding: 18px 20px;
      background: var(--black-scrim);
    }
    .story__name {
      font-family: var(--font-display);
      font-size: 1.6rem;
    }
    .story__copy {
      margin-top: 28px;
    }
    .values {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 14px;
    }
    @media (min-width: 640px) {
      .values {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .values {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .values li {
      position: relative;
      padding: 36px 28px;
      border: 1px solid var(--gold-line);
      transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out);
    }
    .values li:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .values li:hover .icon-ring {
      border-color: var(--color-black);
    }
    .values__n {
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 12px;
      letter-spacing: 0.2em;
    }
    .values h3 {
      font-size: 1.6rem;
      margin: 26px 0 10px;
    }
    .values p {
      margin: 0;
      font-size: 15px;
    }
    .visit {
      display: grid;
      gap: 40px;
    }
    @media (min-width: 1024px) {
      .visit {
        grid-template-columns: 1fr 1fr;
        gap: 96px;
        align-items: end;
      }
    }
    .visit__list {
      margin: 0;
      display: grid;
      gap: 0;
      border-top: 1px solid var(--gold-line);
    }
    .visit__list > div {
      padding: 20px 0;
      border-bottom: 1px solid var(--gold-line);
    }
    dt {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 6px;
    }
    dt app-icon {
      width: 16px;
      height: 16px;
    }
    dd {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
    }
    dd a {
      text-underline-offset: 4px;
    }
  `,
})
export class AboutPage {
  protected readonly site = SITE;
  protected readonly leader = SITE.leader;
  protected readonly images = IMAGES;
  protected readonly promises = PROMISES;
  protected readonly address = fullAddress();
}
