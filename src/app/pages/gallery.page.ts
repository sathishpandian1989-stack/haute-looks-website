import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { RevealDirective } from '../shared/reveal.directive';
import { BeforeAfterComponent } from '../components/before-after.component';
import { CtaBandComponent } from '../components/cta-band.component';
import { IMAGES, Img, TRANSFORMATIONS } from '../core/content';
import { SITE } from '../core/site.config';

@Component({
  selector: 'app-gallery',
  imports: [IconComponent, PictureComponent, RevealDirective, BeforeAfterComponent, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero" aria-labelledby="page-h">
      <div class="page-hero__media"><app-picture [img]="hero" [eager]="true" sizes="100vw" [decorative]="true" /></div>
      <div class="container">
        <p class="eyebrow">Gallery</p>
        <h1 id="page-h" class="display-1" appReveal>Looks we <span class="italic">love</span></h1>
        <p class="lead" appReveal [revealDelay]="150">
          A glimpse of the hair, colour and bridal looks we create. Follow
          <a [href]="site.instagram.url" target="_blank" rel="noopener">{{ site.instagram.handle }}</a> for our latest work.
        </p>
      </div>
    </section>

    <section class="section" aria-label="Photo gallery">
      <div class="container">
        <ul class="grid">
          @for (g of gallery; track g.tag; let i = $index) {
            <li class="cell cell--{{ g.area }}" [class.cell--tall]="g.tall" appReveal [revealDelay]="(i % 3) * 100">
              @if (g.img; as img) {
                <button type="button" class="tile" (click)="openLightbox(img)" [attr.aria-label]="'View larger: ' + img.alt">
                  <app-picture [img]="img" sizes="(min-width: 1024px) 33vw, 50vw" />
                  <span class="tile__cap">
                    <span class="micro">{{ g.tag }}</span>
                    <app-icon name="plus" />
                  </span>
                </button>
              } @else {
                <a class="ig-tile on-gold" [href]="site.instagram.url" target="_blank" rel="noopener">
                  <app-icon name="instagram" [stroke]="1.25" />
                  <span class="ig-tile__text">See our latest looks</span>
                  <span class="micro">{{ site.instagram.handle }}</span>
                </a>
              }
            </li>
          }
        </ul>
        <div class="ig" appReveal>
          <a class="btn btn--ghost" [href]="site.instagram.url" target="_blank" rel="noopener">
            <app-icon name="instagram" /> More on Instagram
          </a>
        </div>
      </div>
    </section>

    <section class="section section--rule" aria-labelledby="ba-h">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Transformations</p>
            <h2 id="ba-h" class="display-2" appReveal>Slide to see the <span class="italic">transformation</span></h2>
          </div>
          <p appReveal [revealDelay]="120">
            Explore selected looks and styling transformations from our studio. Drag the handle — or focus it and use the arrow
            keys — to compare the before and after.
          </p>
        </div>
        <div class="ba-grid">
          @for (t of transformations; track t.title; let i = $index) {
            <div appReveal [revealDelay]="(i % 2) * 120"><app-before-after [item]="t" /></div>
          }
        </div>
        <p class="notice note">
          <app-icon name="alert-circle" />
          <span
            >Sample transformations shown for preview. They will be replaced with HAUTE LOOKS client photos, published only with
            each client’s written permission.</span
          >
        </p>
      </div>
    </section>

    <app-cta-band heading="Love a look you see here?" text="Send us the photo on WhatsApp and we’ll tell you how we can create it for you." />

    <dialog #dlg class="lb" (click)="onBackdrop($event)" (close)="current.set(null)" aria-label="Image viewer">
      @if (current(); as img) {
        <figure>
          <app-picture [img]="img" sizes="90vw" [eager]="true" [width]="null" [height]="null" />
          <figcaption>{{ img.alt }}</figcaption>
        </figure>
      }
      <button type="button" class="lb__close" (click)="closeLightbox()" aria-label="Close image viewer"><app-icon name="x" /></button>
    </dialog>
  `,
  styles: `
    .page-hero a {
      text-underline-offset: 4px;
    }
    .grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: clamp(170px, 42vw, 280px);
      grid-auto-flow: dense;
      gap: 12px;
    }
    .cell--tall {
      grid-row: span 2;
    }
    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-auto-rows: clamp(220px, 21vw, 300px);
        gap: 14px;
      }
      .cell--a { grid-area: 1 / 1 / 3 / 2; }
      .cell--b { grid-area: 1 / 2 / 2 / 3; }
      .cell--c { grid-area: 1 / 3 / 3 / 4; }
      .cell--d { grid-area: 2 / 2 / 3 / 3; }
      .cell--e { grid-area: 3 / 1 / 5 / 2; }
      .cell--f { grid-area: 3 / 2 / 5 / 3; }
      .cell--g { grid-area: 3 / 3 / 4 / 4; }
      .cell--h { grid-area: 4 / 3 / 5 / 4; }
    }
    .cell {
      min-height: 0;
    }
    .cell--f .tile ::ng-deep img {
      object-position: center 15%;
    }
    .ig-tile {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 14px;
      padding: 20px;
      text-align: center;
      overflow: hidden;
      text-decoration: none;
      background: var(--color-gold);
      color: var(--color-black);
      transition: background 0.5s var(--ease-out), color 0.5s var(--ease-out);
    }
    .ig-tile app-icon {
      width: 44px;
      height: 44px;
    }
    .ig-tile .micro {
      display: none;
    }
    @media (min-width: 640px) {
      .ig-tile .micro {
        display: block;
      }
    }
    .ig-tile__text {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 2.4vw, 2rem);
      line-height: 1.1;
    }
    .ig-tile:hover {
      background: var(--color-black);
      color: var(--color-gold);
      outline: 1px solid var(--color-gold);
      outline-offset: -1px;
    }
    .tile {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      padding: 0;
      border: 1px solid var(--gold-line);
      background: none;
      cursor: zoom-in;
      overflow: hidden;
    }
    .tile ::ng-deep img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s var(--ease-out);
    }
    .tile:hover ::ng-deep img,
    .tile:focus-visible ::ng-deep img {
      transform: scale(1.04);
    }
    .tile__cap {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      background: var(--black-scrim);
      transform: translateY(100%);
      transition: transform 0.5s var(--ease-out);
    }
    .tile__cap app-icon {
      width: 18px;
      height: 18px;
    }
    .tile:hover .tile__cap,
    .tile:focus-visible .tile__cap {
      transform: none;
    }
    @media (hover: none) {
      .tile__cap {
        transform: none;
      }
    }
    .ig {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
    .ba-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 28px;
    }
    .ba-grid > div {
      flex: 0 0 100%;
      min-width: 0;
    }
    @media (min-width: 768px) {
      .ba-grid > div {
        flex-basis: calc(50% - 14px);
      }
    }

    .note {
      margin-top: 32px;
    }
    .lb {
      max-width: min(92vw, 1100px);
      max-height: 92vh;
      padding: 0;
      border: 1px solid var(--color-gold);
      background: var(--color-black);
      color: var(--color-gold);
      overflow: visible;
    }
    .lb::backdrop {
      background: rgba(23, 23, 23, 0.92);
    }
    .lb[open] {
      animation: lb-in 0.5s var(--ease-out);
    }
    .lb figure {
      margin: 0;
    }
    .lb ::ng-deep img {
      max-height: 80vh;
      width: auto;
      margin: 0 auto;
    }
    .lb figcaption {
      padding: 14px 18px;
      font-size: 14px;
    }
    .lb__close {
      position: absolute;
      top: -18px;
      right: -18px;
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 0;
      background: var(--color-gold);
      color: var(--color-black);
      cursor: pointer;
    }
    .lb__close app-icon {
      width: 20px;
      height: 20px;
    }
    @media (max-width: 640px) {
      .lb__close {
        top: 8px;
        right: 8px;
      }
    }
    @keyframes lb-in {
      from {
        opacity: 0;
        transform: scale(0.96);
      }
    }
  `,
})
export class GalleryPage {
  protected readonly site = SITE;
  protected readonly hero = IMAGES.haircut;
  protected readonly transformations = TRANSFORMATIONS;
  /** Fixed editorial grid: a–h map to grid areas on desktop; tall cells span two rows on smaller screens. */
  protected readonly gallery: { area: string; tag: string; tall: boolean; img?: Img }[] = [
    { area: 'a', tag: 'Bridal', tall: true, img: IMAGES.bridal },
    { area: 'b', tag: 'Haircut', tall: false, img: IMAGES.haircut },
    { area: 'c', tag: 'Hair colour', tall: true, img: IMAGES.colour },
    { area: 'd', tag: 'Bridal jewellery', tall: false, img: IMAGES.bridalJewellery },
    { area: 'e', tag: 'Smoothening', tall: true, img: IMAGES.smoothening },
    { area: 'f', tag: 'Our studio', tall: true, img: IMAGES.team },
    { area: 'g', tag: 'Bridal details', tall: false, img: IMAGES.bridalBangles },
    { area: 'h', tag: 'Instagram', tall: false },
  ];
  protected readonly current = signal<Img | null>(null);
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected openLightbox(img: Img): void {
    this.current.set(img);
    this.dlg().nativeElement.showModal();
  }

  protected closeLightbox(): void {
    this.dlg().nativeElement.close();
  }

  protected onBackdrop(e: MouseEvent): void {
    if (e.target === this.dlg().nativeElement) this.closeLightbox();
  }
}
