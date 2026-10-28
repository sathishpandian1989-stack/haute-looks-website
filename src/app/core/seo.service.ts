import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { SITE, fullAddress } from './site.config';

export interface SeoData {
  title: string;
  description: string;
  path: string;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly titleSvc = inject(Title);

  apply(data: SeoData): void {
    const url = `${SITE.url}${data.path === '/' ? '/' : data.path.replace(/\/?$/, '/')}`;
    const image = `${SITE.url}/${data.image ?? 'images/og-image.jpg'}`;

    this.titleSvc.setTitle(data.title);
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);

    this.setJsonLd();
  }

  /** BeautySalon structured data built only from the central (client-supplied) configuration. */
  private setJsonLd(): void {
    if (this.doc.getElementById('ld-business')) return;
    const a = SITE.address;
    const json = {
      '@context': 'https://schema.org',
      '@type': 'BeautySalon',
      name: SITE.fullName,
      url: `${SITE.url}/`,
      image: `${SITE.url}/images/og-image.jpg`,
      telephone: SITE.phones.map((p) => `+${p.digits}`),
      email: SITE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${a.street}, ${a.locality}`,
        addressLocality: a.city,
        addressRegion: a.region,
        postalCode: a.postalCode,
        addressCountry: a.country,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: SITE.hours.opens,
          closes: SITE.hours.closes,
        },
      ],
      sameAs: [SITE.instagram.url],
      ...(SITE.leader.name ? { founder: { '@type': 'Person', name: SITE.leader.name } } : {}),
      description: `${SITE.tagline}. Hair, skin and makeup services at ${fullAddress()}.`,
    };
    const script = this.doc.createElement('script');
    script.id = 'ld-business';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(json);
    this.doc.head.appendChild(script);
  }
}
