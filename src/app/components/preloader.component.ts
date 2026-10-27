import { ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IntroService } from '../core/intro.service';

/**
 * Opening sequence: dark screen → gold wordmark reveal → curtain split into the hero.
 * Plays once per browser session, is skippable with a click/keypress and never plays
 * for reduced-motion users (handled in IntroService + CSS).
 */
@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="pre" [class.pre--exit]="exiting()" (click)="skip()" role="presentation" aria-hidden="true">
        <div class="pre__half pre__half--top"></div>
        <div class="pre__half pre__half--bottom"></div>
        <div class="pre__mark">
          <div class="pre__word">
            @for (ch of letters; track $index) {
              <span class="pre__ch" [style.--i]="$index">{{ ch === ' ' ? ' ' : ch }}</span>
            }
          </div>
          <div class="pre__rule"></div>
          <div class="pre__sub">Unisex Salon &amp; Bridal Studio · Karaikudi</div>
        </div>
      </div>
    }
  `,
  styles: `
    .pre {
      position: fixed;
      inset: 0;
      z-index: 999;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    :host-context(html.intro-seen) .pre,
    :host-context(html:not(.js)) .pre {
      display: none;
    }
    .pre__half {
      position: absolute;
      left: 0;
      right: 0;
      height: 50.5%;
      background: var(--color-black);
      transition: transform 1s var(--ease-cinema);
    }
    .pre__half--top {
      top: 0;
    }
    .pre__half--bottom {
      bottom: 0;
    }
    .pre--exit .pre__half--top {
      transform: translateY(-100%);
    }
    .pre--exit .pre__half--bottom {
      transform: translateY(100%);
    }
    .pre__mark {
      position: relative;
      text-align: center;
      padding: 0 16px;
      transition: opacity 0.5s, transform 1s var(--ease-cinema);
    }
    .pre--exit .pre__mark {
      opacity: 0;
      transform: scale(1.08);
    }
    .pre__word {
      display: flex;
      justify-content: center;
      overflow: hidden;
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 9vw, 6rem);
      font-weight: 500;
      letter-spacing: 0.18em;
      line-height: 1.1;
      padding-left: 0.18em;
    }
    .pre__ch {
      display: inline-block;
      transform: translateY(110%);
      animation: ch-in 0.9s var(--ease-out) forwards;
      animation-delay: calc(0.15s + var(--i) * 0.055s);
    }
    .pre__rule {
      height: 1px;
      margin: 18px auto 16px;
      width: min(320px, 70vw);
      background: var(--color-gold);
      transform: scaleX(0);
      animation: rule-in 1s var(--ease-cinema) 0.75s forwards;
    }
    .pre__sub {
      font-size: 11px;
      letter-spacing: 0.34em;
      text-transform: uppercase;
      font-weight: 600;
      opacity: 0;
      animation: fade-in 0.8s ease 1.1s forwards;
    }
    @keyframes ch-in {
      to {
        transform: none;
      }
    }
    @keyframes rule-in {
      to {
        transform: none;
      }
    }
    @keyframes fade-in {
      to {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .pre {
        display: none;
      }
    }
  `,
})
export class PreloaderComponent implements OnInit {
  private readonly intro = inject(IntroService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly letters = 'HAUTE LOOKS'.split('');
  protected readonly visible = signal(true);
  protected readonly exiting = signal(false);
  private timers: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    if (!this.isBrowser) return;
    if (!this.intro.shouldPlay()) {
      this.visible.set(false);
      return;
    }
    this.timers.push(setTimeout(() => this.exit(), 2000));
    window.addEventListener('keydown', this.skip, { once: true });
  }

  protected skip = (): void => {
    this.exit();
  };

  private exit(): void {
    if (this.exiting()) return;
    this.timers.forEach(clearTimeout);
    this.exiting.set(true);
    this.intro.finish();
    this.timers = [setTimeout(() => this.visible.set(false), 1100)];
  }
}
