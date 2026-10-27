import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { SITE, fullAddress, telLink, whatsappLink } from '../core/site.config';
import { NAV } from './header.component';
import { AnalyticsService } from '../core/analytics.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="ftr">
      <div class="container">
        <div class="ftr__cta">
          <p class="eyebrow">Appointments open daily</p>
          <h2 class="ftr__big" appReveal>
            Ready for your <span class="italic">signature</span> look?
          </h2>
          <a class="btn" [href]="wa" target="_blank" rel="noopener" (click)="track('whatsapp_click')">
            <app-icon name="message-circle" /> Book on WhatsApp
          </a>
        </div>

        <hr class="hairline" />

        <div class="ftr__grid">
          <div>
            <a routerLink="/" class="ftr__brand">HAUTE LOOKS</a>
            <p class="ftr__desc">{{ site.tagline }}. Hair, skin and makeup in {{ site.city }}.</p>
            <a class="social" [href]="site.instagram.url" target="_blank" rel="noopener" aria-label="Instagram {{ site.instagram.handle }}">
              <app-icon name="instagram" /> {{ site.instagram.handle }}
            </a>
          </div>

          <nav aria-label="Footer">
            <h3 class="micro">Explore</h3>
            <ul>
              @for (item of nav; track item.path) {
                <li><a [routerLink]="item.path">{{ item.label }}</a></li>
              }
              <li><a routerLink="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </nav>

          <div>
            <h3 class="micro">Visit</h3>
            <address>
              <a [href]="site.directionsUrl" target="_blank" rel="noopener" class="row">
                <app-icon name="map-pin" /><span>{{ address }}</span>
              </a>
              <p class="row"><app-icon name="clock" /><span>{{ site.hours.label }}<br />{{ site.hours.display }}</span></p>
            </address>
          </div>

          <div>
            <h3 class="micro">Talk to us</h3>
            <ul>
              @for (p of site.phones; track p.digits) {
                <li>
                  <a class="row" [href]="tel(p)" (click)="track('phone_click')"><app-icon name="phone" /><span>{{ p.display }}</span></a>
                </li>
              }
              <li>
                <a class="row" [href]="'mailto:' + site.email"><app-icon name="mail" /><span>{{ site.email }}</span></a>
              </li>
            </ul>
          </div>
        </div>

        <div class="ftr__base">
          <span>© {{ year }} {{ site.fullName }}</span>
          <span>Karaikudi · Tamil Nadu</span>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .ftr {
      border-top: 1px solid var(--gold-line);
      padding: clamp(64px, 9vw, 120px) 0 calc(28px + env(safe-area-inset-bottom));
    }
    .ftr__cta {
      display: grid;
      justify-items: start;
      gap: 8px;
      margin-bottom: clamp(48px, 7vw, 88px);
    }
    .ftr__big {
      font-size: clamp(2.4rem, 6.4vw, 5rem);
      text-transform: uppercase;
      max-width: 16ch;
      margin-bottom: 28px;
    }
    .ftr__grid {
      display: grid;
      gap: 40px;
      padding: 56px 0;
      grid-template-columns: 1fr;
    }
    @media (min-width: 640px) {
      .ftr__grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (min-width: 1024px) {
      .ftr__grid {
        grid-template-columns: 1.4fr 0.8fr 1fr 1fr;
      }
    }
    .ftr__brand {
      font-family: var(--font-display);
      font-size: 32px;
      letter-spacing: 0.2em;
      text-decoration: none;
    }
    .ftr__desc {
      margin-top: 14px;
      max-width: 34ch;
      font-size: 15px;
    }
    h3 {
      margin-bottom: 18px;
      font-family: var(--font-body);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }
    ul a,
    address a {
      text-decoration: none;
      font-size: 15px;
    }
    ul a:hover,
    address a:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    address {
      font-style: normal;
      display: grid;
      gap: 14px;
      font-size: 15px;
    }
    .row {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin: 0;
    }
    .row app-icon,
    .social app-icon {
      width: 18px;
      height: 18px;
      flex: none;
      margin-top: 4px;
    }
    .social {
      display: inline-flex;
      gap: 10px;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 10px 16px;
      border: 1px solid var(--gold-line);
      transition: background 0.3s, color 0.3s;
    }
    .social app-icon {
      margin: 0;
    }
    .social:hover {
      background: var(--color-gold);
      color: var(--color-black);
    }
    .ftr__base {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      padding-top: 24px;
      border-top: 1px solid var(--gold-line);
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    @media (max-width: 1079px) {
      .ftr {
        padding-bottom: calc(96px + env(safe-area-inset-bottom));
      }
    }
  `,
})
export class FooterComponent {
  private readonly analytics = inject(AnalyticsService);
  protected readonly site = SITE;
  protected readonly nav = NAV;
  protected readonly address = fullAddress();
  protected readonly wa = whatsappLink();
  protected readonly tel = telLink;
  protected readonly year = new Date().getFullYear();

  protected track(name: string): void {
    this.analytics.event(name, { location: 'footer' });
  }
}
