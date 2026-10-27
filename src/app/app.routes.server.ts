import { RenderMode, ServerRoute } from '@angular/ssr';

/** Every route is prerendered to static HTML at build time (GitHub Pages friendly). */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'services', renderMode: RenderMode.Prerender },
  { path: 'bridal-studio', renderMode: RenderMode.Prerender },
  { path: 'gallery', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
