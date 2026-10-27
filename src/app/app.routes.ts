import { Routes } from '@angular/router';
import { SeoData } from './core/seo.service';

const seo = (path: string, title: string, description: string, image?: string): { seo: SeoData } => ({
  seo: { path, title, description, image },
});

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.page').then((m) => m.HomePage),
    data: seo(
      '/',
      'HAUTE LOOKS Unisex Salon & Bridal Studio | Karaikudi',
      'Explore hair, skin and makeup services at HAUTE LOOKS Unisex Salon & Bridal Studio in Karaikudi. Call or WhatsApp to enquire about appointments.',
    ),
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services.page').then((m) => m.ServicesPage),
    data: seo(
      '/services',
      'Hair, Skin & Makeup Services in Karaikudi | HAUTE LOOKS',
      'Haircuts, styling, hair colour, smoothening, grooming, skin care and makeup at HAUTE LOOKS Unisex Salon, Karaikudi. Enquire on WhatsApp for prices.',
    ),
  },
  {
    path: 'bridal-studio',
    loadComponent: () => import('./pages/bridal.page').then((m) => m.BridalPage),
    data: seo(
      '/bridal-studio',
      'Bridal Makeup & Hair in Karaikudi | HAUTE LOOKS Bridal Studio',
      'Bridal makeup, bridal hairstyling and packages planned around your event at HAUTE LOOKS Bridal Studio, Karaikudi. Share your date to enquire.',
    ),
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery.page').then((m) => m.GalleryPage),
    data: seo(
      '/gallery',
      'Gallery & Transformations | HAUTE LOOKS Karaikudi',
      'See looks and styling transformations from HAUTE LOOKS Unisex Salon & Bridal Studio in Karaikudi.',
    ),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about.page').then((m) => m.AboutPage),
    data: seo(
      '/about',
      'About Us | HAUTE LOOKS Unisex Salon & Bridal Studio',
      'A personal approach to every look. Meet the people behind HAUTE LOOKS Unisex Salon & Bridal Studio in Karaikudi.',
      'images/team-lead-1200.webp',
    ),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact.page').then((m) => m.ContactPage),
    data: seo(
      '/contact',
      'Contact & Book | HAUTE LOOKS Salon Karaikudi',
      'Call, WhatsApp or send an enquiry to HAUTE LOOKS Unisex Salon & Bridal Studio, College Road, Karaikudi. Open all 7 days.',
    ),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy.page').then((m) => m.PrivacyPage),
    data: seo(
      '/privacy-policy',
      'Privacy Policy | HAUTE LOOKS',
      'How HAUTE LOOKS collects, uses and stores the details you share through our enquiry form.',
    ),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage),
    data: seo('/404', 'Page not found | HAUTE LOOKS', 'The page you were looking for could not be found.'),
  },
];
