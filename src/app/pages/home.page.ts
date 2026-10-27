import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { RevealDirective } from '../shared/reveal.directive';
import { ParallaxDirective } from '../shared/parallax.directive';
import { MarqueeComponent } from '../components/marquee.component';
import { ServiceBentoComponent } from '../components/service-bento.component';
import { BeforeAfterComponent } from '../components/before-after.component';
import { ReviewsComponent } from '../components/reviews.component';
import { FaqComponent } from '../components/faq.component';
import { CtaBandComponent } from '../components/cta-band.component';
import { IntroService } from '../core/intro.service';
import { AnalyticsService } from '../core/analytics.service';
import { FAQS, IMAGES, PROMISES, TRANSFORMATIONS } from '../core/content';
import { SITE, whatsappLink } from '../core/site.config';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    IconComponent,
    PictureComponent,
    RevealDirective,
    ParallaxDirective,
    MarqueeComponent,
    ServiceBentoComponent,
    BeforeAfterComponent,
    ReviewsComponent,
    FaqComponent,
    CtaBandComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  protected readonly intro = inject(IntroService);
  private readonly analytics = inject(AnalyticsService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly site = SITE;
  protected readonly wa = whatsappLink();
  protected readonly images = IMAGES;
  protected readonly slides = [IMAGES.bridal, IMAGES.haircut, IMAGES.colour, IMAGES.smoothening];
  protected readonly active = signal(0);
  protected readonly promises = PROMISES;
  protected readonly faqs = FAQS.slice(0, 5);
  protected readonly transformations = TRANSFORMATIONS.slice(0, 2);
  protected readonly pains = [
    { q: 'Not sure which cut suits you?', a: 'A style chosen for you — not just a trend.' },
    { q: 'Frizzy, flat or hard-to-manage hair?', a: 'Hair that looks polished and is easier to manage.' },
    { q: 'Worried colour will look unnatural?', a: 'A shade that complements your look.' },
    { q: 'Planning your wedding look?', a: 'Your bridal look, planned with care for your special day.' },
    { q: 'Unclear prices or surprise add-ons?', a: 'Know what to expect before you book.' },
  ];

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    if (this.isBrowser) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      effect(() => {
        if (this.intro.done() && !reduce && !this.timer) this.startAuto();
      });
      inject(DestroyRef).onDestroy(() => this.stopAuto());
    }
  }

  protected goTo(i: number): void {
    this.stopAuto();
    this.active.set(i);
  }

  protected track(name: string): void {
    this.analytics.event(name, { location: 'home_hero' });
  }

  private startAuto(): void {
    this.timer = setInterval(() => this.active.update((i) => (i + 1) % this.slides.length), 6500);
  }

  private stopAuto(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
