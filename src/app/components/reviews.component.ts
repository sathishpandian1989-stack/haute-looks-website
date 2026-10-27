import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SITE } from '../core/site.config';

/**
 * Reviews section. Intentionally shows NO star rating, review count or quotes until genuine,
 * verified Google reviews for HAUTE LOOKS are supplied (see brief §5). Add verified items to
 * `reviews` below (with permission) and they render as cards linking back to Google.
 */
interface VerifiedReview {
  author: string;
  text: string;
  date: string;
}

@Component({
  selector: 'app-reviews',
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--rule" aria-labelledby="reviews-h">
      <div class="container">
        <div class="rv">
          <div>
            <p class="eyebrow">Kind words from our clients</p>
            <h2 id="reviews-h" class="display-2" appReveal>Your experience <span class="italic">matters</span> to us.</h2>
          </div>
          <div class="rv__side" appReveal [revealDelay]="150">
            <p class="lead">
              Real experiences from people who have visited HAUTE LOOKS. Read what our guests say — or share your own — on our
              Google profile.
            </p>
            <div class="rv__actions">
              <a class="btn" [href]="google" target="_blank" rel="noopener"><app-icon name="star" /> View us on Google</a>
              <a class="btn btn--ghost" [href]="google" target="_blank" rel="noopener">Leave a review</a>
            </div>
          </div>
        </div>

        @if (reviews.length) {
          <ul class="rv__list">
            @for (r of reviews; track r.author) {
              <li appReveal>
                <blockquote>
                  <p>“{{ r.text }}”</p>
                  <footer>{{ r.author }} · {{ r.date }} · Google</footer>
                </blockquote>
              </li>
            }
          </ul>
        }
      </div>
    </section>
  `,
  styles: `
    .rv {
      display: grid;
      gap: 32px;
    }
    @media (min-width: 900px) {
      .rv {
        grid-template-columns: 1.2fr 1fr;
        gap: 72px;
        align-items: end;
      }
    }
    .rv__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }
    .rv__list {
      list-style: none;
      padding: 0;
      margin: 56px 0 0;
      display: grid;
      gap: 16px;
    }
    @media (min-width: 900px) {
      .rv__list {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    blockquote {
      margin: 0;
      padding: 32px;
      border: 1px solid var(--gold-line);
      height: 100%;
    }
    blockquote p {
      font-family: var(--font-display);
      font-size: 1.4rem;
      line-height: 1.4;
    }
    blockquote footer {
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
  `,
})
export class ReviewsComponent {
  protected readonly google = SITE.googleProfileUrl;
  /** Add ONLY verified reviews from the official HAUTE LOOKS Google profile, with permission. */
  protected readonly reviews: VerifiedReview[] = [];
}
