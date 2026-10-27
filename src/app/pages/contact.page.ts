import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { PictureComponent } from '../shared/picture.component';
import { ContactCardsComponent } from '../components/contact-cards.component';
import { BookingFormComponent } from '../components/booking-form.component';
import { IMAGES } from '../core/content';
import { SITE, fullAddress } from '../core/site.config';

@Component({
  selector: 'app-contact',
  imports: [IconComponent, RevealDirective, PictureComponent, ContactCardsComponent, BookingFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero" aria-labelledby="page-h">
      <div class="page-hero__media"><app-picture [img]="hero" [eager]="true" sizes="100vw" [decorative]="true" /></div>
      <div class="container">
        <p class="eyebrow">Contact</p>
        <h1 id="page-h" class="display-1" appReveal>Let’s create your <span class="italic">signature look.</span></h1>
        <p class="lead" appReveal [revealDelay]="150">
          Tell us what you have in mind. Call or WhatsApp HAUTE LOOKS to ask about services, prices and appointment
          availability.
        </p>
      </div>
    </section>

    <section class="section" aria-labelledby="reach-h">
      <div class="container">
        <p class="eyebrow">Contact information</p>
        <h2 id="reach-h" class="display-2 reach-h" appReveal>Reach us <span class="italic">your way</span></h2>
        <app-contact-cards />
      </div>
    </section>

    <section id="enquiry" class="section section--rule" aria-labelledby="enq-h">
      <div class="container enq">
        <aside class="enq__side">
          <p class="eyebrow">Enquiry form</p>
          <h2 id="enq-h" class="display-2" appReveal>Send us an <span class="italic">enquiry</span></h2>
          <p class="lead">
            Share a few details and our team will get back to you on WhatsApp. Your appointment is confirmed only when the salon
            replies and confirms availability.
          </p>
          <ul class="enq__points">
            <li><app-icon name="clock" /> {{ site.hours.label }} · {{ site.hours.display }}</li>
            <li><app-icon name="shield-check" /> Your details are used only to respond to your enquiry</li>
            <li><app-icon name="message-circle" /> Prefer chat? WhatsApp {{ site.phones[0].display }}</li>
          </ul>
        </aside>
        <app-booking-form />
      </div>
    </section>

    <section class="section section--rule" aria-labelledby="map-h">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Location</p>
            <h2 id="map-h" class="display-2" appReveal>Find us in <span class="italic">Karaikudi</span></h2>
          </div>
          <div>
            <p>{{ address }}</p>
            <a class="btn" [href]="site.directionsUrl" target="_blank" rel="noopener"><app-icon name="navigation" /> Get directions</a>
          </div>
        </div>
        @if (mapUrl(); as url) {
          <div class="map" appReveal="mask">
            <iframe
              [src]="url"
              title="Map showing HAUTE LOOKS Unisex Salon & Bridal Studio, Karaikudi"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            ></iframe>
          </div>
        } @else {
          <a class="map map--card" [href]="site.directionsUrl" target="_blank" rel="noopener" appReveal>
            <span class="map__pin"><app-icon name="map-pin" [stroke]="1" /></span>
            <span class="map__addr">{{ site.address.street }}<br />{{ site.address.locality }}<br />{{ site.address.city }} {{ site.address.postalCode }}</span>
            <span class="link-underline">Open in Google Maps <app-icon name="arrow-up-right" /></span>
          </a>
        }
      </div>
    </section>
  `,
  styles: `
    .reach-h {
      margin-bottom: clamp(36px, 5vw, 64px);
    }
    .enq {
      display: grid;
      gap: 48px;
    }
    @media (min-width: 1024px) {
      .enq {
        grid-template-columns: 0.8fr 1.2fr;
        gap: 96px;
      }
      .enq__side {
        position: sticky;
        top: calc(var(--header-h) + 32px);
        align-self: start;
      }
    }
    .enq__side .lead {
      margin-top: 24px;
    }
    .enq__points {
      list-style: none;
      margin: 32px 0 0;
      padding: 0;
      display: grid;
      gap: 14px;
      font-size: 15px;
    }
    .enq__points li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .enq__points app-icon {
      width: 18px;
      height: 18px;
      flex: none;
      margin-top: 4px;
    }
    .section-head .btn {
      margin-top: 16px;
    }
    .map {
      display: block;
      position: relative;
      width: 100%;
      min-height: 360px;
      border: 1px solid var(--gold-line);
      overflow: hidden;
    }
    @media (min-width: 768px) {
      .map {
        aspect-ratio: 16 / 7;
      }
    }
    .map iframe {
      width: 100%;
      height: 100%;
      border: 0;
      filter: grayscale(1) contrast(1.1);
    }
    .map--card {
      display: grid;
      place-content: center;
      justify-items: center;
      gap: 24px;
      padding: 40px 20px;
      text-align: center;
      text-decoration: none;
      transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out);
    }
    .map--card:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .map__pin app-icon {
      width: 72px;
      height: 72px;
    }
    .map__addr {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 2.6vw, 2.2rem);
      line-height: 1.3;
    }
  `,
})
export class ContactPage {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly site = SITE;
  protected readonly hero = IMAGES.bridal;
  protected readonly address = fullAddress();
  // Embed URL comes only from the trusted central config (Google Maps embed link).
  protected readonly mapUrl = computed(() =>
    SITE.mapEmbedUrl.startsWith('https://www.google.com/maps/embed')
      ? this.sanitizer.bypassSecurityTrustResourceUrl(SITE.mapEmbedUrl)
      : null,
  );
}
