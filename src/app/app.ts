import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';
import { PreloaderComponent } from './components/preloader.component';
import { QuickContactComponent } from './components/quick-contact.component';
import { ConsentBannerComponent } from './components/consent-banner.component';
import { SeoData, SeoService } from './core/seo.service';
import { AnalyticsService } from './core/analytics.service';
import { AttributionService } from './core/attribution.service';
import { IntroService } from './core/intro.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PreloaderComponent, QuickContactComponent, ConsentBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-preloader />
    <app-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-quick-contact />
    <app-consent-banner />
  `,
  styles: `
    main {
      display: block;
      outline: none;
    }
  `,
})
export class App {
  constructor() {
    const router = inject(Router);
    const route = inject(ActivatedRoute);
    const seo = inject(SeoService);
    const analytics = inject(AnalyticsService);

    inject(IntroService).init();
    inject(AttributionService).capture();
    analytics.init();

    router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      let r = route.firstChild;
      while (r?.firstChild) r = r.firstChild;
      const data = r?.snapshot.data['seo'] as SeoData | undefined;
      if (data) seo.apply(data);
      analytics.pageView(e.urlAfterRedirects);
    });
  }
}
