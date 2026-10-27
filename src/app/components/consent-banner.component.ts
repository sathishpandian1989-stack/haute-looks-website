import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../core/analytics.service';

/** Shown only when a GA4 ID is configured and the visitor hasn't chosen yet. */
@Component({
  selector: 'app-consent-banner',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (analytics.enabled && analytics.consent() === 'unset') {
      <section class="cb" aria-label="Analytics consent">
        <p>
          We'd like to use Google Analytics to understand how visitors use this site. No data is collected unless you allow
          it. <a routerLink="/privacy-policy">Privacy policy</a>
        </p>
        <div class="cb__actions">
          <button class="btn btn--ghost" type="button" (click)="analytics.setConsent(false)">Decline</button>
          <button class="btn" type="button" (click)="analytics.setConsent(true)">Allow</button>
        </div>
      </section>
    }
  `,
  styles: `
    .cb {
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: calc(74px + env(safe-area-inset-bottom));
      z-index: 85;
      max-width: 560px;
      padding: 20px;
      background: var(--color-black);
      border: 1px solid var(--color-gold);
      font-size: 14px;
      display: grid;
      gap: 14px;
    }
    .cb p {
      margin: 0;
    }
    .cb__actions {
      display: flex;
      gap: 10px;
    }
    .cb .btn {
      min-height: 44px;
      padding: 10px 20px;
      font-size: 11px;
    }
    @media (min-width: 1080px) {
      .cb {
        bottom: 24px;
        left: 24px;
      }
    }
  `,
})
export class ConsentBannerComponent {
  protected readonly analytics = inject(AnalyticsService);
}
