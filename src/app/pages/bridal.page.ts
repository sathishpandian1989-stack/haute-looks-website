import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { RevealDirective } from '../shared/reveal.directive';
import { ParallaxDirective } from '../shared/parallax.directive';
import { BookingFormComponent } from '../components/booking-form.component';
import { FaqComponent } from '../components/faq.component';
import { IMAGES } from '../core/content';
import { serviceEnquiry } from '../core/site.config';

@Component({
  selector: 'app-bridal',
  imports: [RouterLink, IconComponent, PictureComponent, RevealDirective, ParallaxDirective, BookingFormComponent, FaqComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero bridal-hero" aria-labelledby="page-h">
      <div class="page-hero__media"><app-picture [img]="img" [eager]="true" sizes="100vw" [decorative]="true" /></div>
      <div class="container">
        <p class="eyebrow">Bridal Studio · Karaikudi</p>
        <h1 id="page-h" class="display-1" appReveal>The bride, <span class="italic">beautifully you</span></h1>
        <p class="lead" appReveal [revealDelay]="150">
          Bridal makeup, bridal hairstyling and packages planned with care for your special day.
        </p>
        <div class="hero-ctas" appReveal [revealDelay]="250">
          <a class="btn" [href]="wa" target="_blank" rel="noopener"><app-icon name="message-circle" /> Enquire on WhatsApp</a>
          <a class="btn btn--ghost" routerLink="/bridal-studio" fragment="bridal-enquiry">Share your date</a>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="offer-h">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">What we plan together</p>
            <h2 id="offer-h" class="display-2" appReveal>Every detail, <span class="italic">considered</span></h2>
          </div>
          <p appReveal [revealDelay]="120">
            Final packages depend on your requirements — the number of functions, looks and people. Tell us about your event and
            we’ll talk you through the available options.
          </p>
        </div>
        <ul class="offer">
          @for (o of offer; track o.title; let i = $index) {
            <li appReveal [revealDelay]="i * 100">
              <span class="icon-ring"><app-icon [name]="o.icon" /></span>
              <h3>{{ o.title }}</h3>
              <p>{{ o.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="section section--rule" aria-labelledby="steps-h">
      <div class="container steps-wrap">
        <div class="steps-media" appReveal="mask">
          <div class="steps-img" appParallax="0.06"><app-picture [img]="img" sizes="(min-width: 1024px) 40vw, 100vw" /></div>
        </div>
        <div>
          <p class="eyebrow">How it works</p>
          <h2 id="steps-h" class="display-2" appReveal>From first message to <span class="italic">final look</span></h2>
          <ol class="steps">
            @for (s of steps; track s.title; let i = $index) {
              <li appReveal [revealDelay]="i * 90">
                <span class="steps__n">0{{ i + 1 }}</span>
                <div>
                  <h3>{{ s.title }}</h3>
                  <p>{{ s.text }}</p>
                </div>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>

    <section id="bridal-enquiry" class="section section--rule" aria-labelledby="enq-h">
      <div class="container enq">
        <div>
          <p class="eyebrow">Bridal enquiry</p>
          <h2 id="enq-h" class="display-2" appReveal>Tell us about <span class="italic">your day</span></h2>
          <p class="lead">
            Share your event date, functions and any reference looks. We’ll reply on WhatsApp to discuss availability and
            packages.
          </p>
        </div>
        <app-booking-form presetService="Bridal Makeup & Hair Package" />
      </div>
    </section>

    <section class="section section--rule" aria-labelledby="bfaq-h">
      <div class="container">
        <p class="eyebrow">Bridal FAQ</p>
        <h2 id="bfaq-h" class="display-2 bfaq-h" appReveal>Questions brides <span class="italic">ask us</span></h2>
        <app-faq [items]="faqs" />
      </div>
    </section>
  `,
  styles: `
    .bridal-hero .page-hero__media img {
      object-position: center 20%;
    }
    .hero-ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 34px;
    }
    .offer {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 1px;
      background: var(--gold-line);
      border: 1px solid var(--gold-line);
    }
    @media (min-width: 768px) {
      .offer {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .offer li {
      background: var(--color-black);
      padding: 40px 32px;
    }
    .offer h3 {
      font-size: 1.9rem;
      margin: 28px 0 12px;
    }
    .offer p {
      margin: 0;
    }
    .steps-wrap {
      display: grid;
      gap: 48px;
      align-items: center;
    }
    @media (min-width: 1024px) {
      .steps-wrap {
        grid-template-columns: 0.85fr 1.15fr;
        gap: 96px;
      }
    }
    .steps-media {
      position: relative;
      aspect-ratio: 3 / 4;
      overflow: hidden;
    }
    .steps-img {
      position: absolute;
      inset: -6% 0;
    }
    .steps-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .steps {
      list-style: none;
      margin: 36px 0 0;
      padding: 0;
      border-top: 1px solid var(--gold-line);
    }
    .steps li {
      display: grid;
      grid-template-columns: 56px 1fr;
      gap: 16px;
      padding: 26px 0;
      border-bottom: 1px solid var(--gold-line);
    }
    .steps__n {
      font-family: var(--font-display);
      font-size: 2rem;
      line-height: 1;
      font-style: italic;
    }
    .steps h3 {
      font-size: 1.6rem;
      margin-bottom: 6px;
    }
    .steps p {
      margin: 0;
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
    }
    .enq .lead {
      margin-top: 24px;
    }
    .bfaq-h {
      margin-bottom: 40px;
    }
  `,
})
export class BridalPage {
  protected readonly img = IMAGES.bridal;
  protected readonly wa = serviceEnquiry('bridal makeup & hair packages');
  protected readonly offer = [
    { icon: 'brush', title: 'Bridal makeup', text: 'A photo-ready look planned around your outfit, jewellery, skin and the lighting of each function.' },
    { icon: 'sparkles', title: 'Bridal hairstyling', text: 'Traditional buns, braids and contemporary styles, finished with flowers and accessories.' },
    { icon: 'crown', title: 'Bridal packages', text: 'Combine services across your functions. Packages are tailored to your requirements.' },
  ];
  protected readonly steps = [
    { title: 'Share your date', text: 'Message us your event date(s), venue city and the functions you need us for.' },
    { title: 'Talk through your look', text: 'Send reference photos and outfit details — we discuss options and suitable services.' },
    { title: 'Confirm your package', text: 'We share the applicable price. Your booking is confirmed once the salon confirms availability.' },
    { title: 'Your day', text: 'Relax — our team focuses on making you feel comfortable, confident and camera-ready.' },
  ];
  protected readonly faqs = [
    {
      q: 'How early should I enquire for bridal makeup?',
      a: 'As early as possible once your dates are fixed — popular wedding dates fill up. Message us to check availability.',
    },
    {
      q: 'Do you offer bridal packages?',
      a: 'Yes. Contact our team with your event date and requirements so we can discuss the available bridal options.',
    },
    {
      q: 'Can I request a particular bridal look?',
      a: 'Absolutely. Share reference photos when you enquire and we’ll discuss how to adapt the look for you.',
    },
    {
      q: 'How will I know the price?',
      a: 'Prices depend on your functions and requirements. Message us and we will share the applicable price before you book.',
    },
  ];
}
