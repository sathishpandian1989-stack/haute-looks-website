import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SITE } from '../core/site.config';
import { GOOGLE_RATING, REVIEWS } from '../core/content';
import { AnalyticsService } from '../core/analytics.service';

/**
 * Google reviews section. Shows only genuine reviews from the HAUTE LOOKS Google profile
 * (REVIEWS / GOOGLE_RATING in content.ts), each linking back to the source.
 */
@Component({
  selector: 'app-reviews',
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="reviews" class="section section--rule" aria-labelledby="reviews-h">
      <div class="container">
        <div class="rv">
          <div>
            <p class="eyebrow">Kind words from our clients</p>
            <h2 id="reviews-h" class="display-2" appReveal>Loved by <span class="italic">Karaikudi</span></h2>
            <p class="lead rv__lead" appReveal [revealDelay]="100">
              Real experiences from people who have visited HAUTE LOOKS, shared on our Google profile.
            </p>
          </div>

          <a class="badge" [href]="google" target="_blank" rel="noopener" appReveal [revealDelay]="150"
             [attr.aria-label]="'Rated ' + rating.score + ' out of 5 from ' + rating.count + ' Google reviews — read them on Google'">
            <span class="badge__score">{{ rating.score }}</span>
            <span class="badge__meta">
              <span class="stars stars--lg" aria-hidden="true">
                @for (s of five; track $index) {
                  <app-icon name="star" />
                }
              </span>
              <span class="badge__count">{{ rating.count }} Google reviews</span>
            </span>
            <span class="badge__arrow"><app-icon name="arrow-up-right" /></span>
          </a>
        </div>

        <ul class="rv__list">
          @for (r of reviews; track r.author; let i = $index) {
            <li appReveal [revealDelay]="(i % 3) * 100">
              <figure class="card">
                <div class="card__top">
                  <span class="stars" role="img" aria-label="5 out of 5 stars">
                    @for (s of five; track $index) {
                      <app-icon name="star" />
                    }
                  </span>
                  <span class="card__service micro">{{ r.service }}</span>
                </div>
                <blockquote>
                  @for (para of r.text.split('\\n'); track $index) {
                    @if (para.trim()) {
                      <p>{{ para }}{{ r.truncated && $last ? '…' : '' }}</p>
                    }
                  }
                </blockquote>
                <figcaption>
                  <span class="card__avatar" aria-hidden="true">{{ r.author.charAt(0).toUpperCase() }}</span>
                  <span class="card__who">
                    <span class="card__name">{{ r.author }}</span>
                    <span class="card__src">Google review</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          }
        </ul>

        <div class="rv__actions" appReveal>
          <a class="btn" [href]="google" target="_blank" rel="noopener" (click)="track('read_reviews')">
            <app-icon name="star" /> Read all {{ rating.count }} reviews
          </a>
          <a class="btn btn--ghost" [href]="google" target="_blank" rel="noopener" (click)="track('write_review')">Leave a review</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .rv {
      display: grid;
      gap: 32px;
      margin-bottom: clamp(40px, 6vw, 64px);
    }
    @media (min-width: 900px) {
      .rv {
        grid-template-columns: 1.3fr auto;
        gap: 72px;
        align-items: end;
      }
    }
    .rv__lead {
      margin: 22px 0 0;
    }
    .badge {
      position: relative;
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 22px 64px 22px 26px;
      border: 1px solid var(--color-gold);
      text-decoration: none;
      transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out);
    }
    .badge:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .badge__score {
      font-family: var(--font-display);
      font-size: clamp(3.4rem, 6vw, 4.6rem);
      line-height: 1;
    }
    .badge__meta {
      display: grid;
      gap: 8px;
    }
    .badge__count {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .badge__arrow {
      position: absolute;
      top: 16px;
      right: 16px;
    }
    .badge__arrow app-icon {
      width: 18px;
      height: 18px;
    }
    .stars {
      display: inline-flex;
      gap: 3px;
    }
    .stars app-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    .stars ::ng-deep svg {
      fill: currentColor;
    }
    .stars--lg app-icon {
      width: 22px;
      height: 22px;
    }

    .rv__list {
      list-style: none;
      margin: 0;
      padding: 0;
      columns: 1;
      column-gap: 16px;
    }
    @media (min-width: 720px) {
      .rv__list {
        columns: 2;
      }
    }
    @media (min-width: 1100px) {
      .rv__list {
        columns: 3;
      }
    }
    .rv__list li {
      break-inside: avoid;
      margin-bottom: 16px;
    }
    .card {
      margin: 0;
      padding: 30px 28px 26px;
      border: 1px solid var(--gold-line);
      display: grid;
      gap: 20px;
      transition: border-color 0.4s;
    }
    .card:hover {
      border-color: var(--color-gold);
    }
    .card__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .card__service {
      font-size: 10px;
      padding: 5px 10px;
      border: 1px solid var(--gold-line);
    }
    blockquote {
      margin: 0;
    }
    blockquote p {
      font-size: 15px;
      line-height: 1.75;
      margin: 0 0 0.8em;
    }
    blockquote p:last-child {
      margin-bottom: 0;
    }
    figcaption {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-top: 18px;
      border-top: 1px solid var(--gold-line);
    }
    .card__avatar {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      flex: none;
      border-radius: 50%;
      background: var(--color-gold);
      color: var(--color-black);
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 600;
    }
    .card__who {
      display: grid;
    }
    .card__name {
      font-weight: 700;
      font-size: 15px;
    }
    .card__src {
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .rv__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: clamp(32px, 5vw, 48px);
    }
  `,
})
export class ReviewsComponent {
  private readonly analytics = inject(AnalyticsService);
  protected readonly google = SITE.googleProfileUrl;
  protected readonly rating = GOOGLE_RATING;
  protected readonly reviews = REVIEWS;
  protected readonly five = [1, 2, 3, 4, 5];

  protected track(name: string): void {
    this.analytics.event(name, { location: 'reviews' });
  }
}
