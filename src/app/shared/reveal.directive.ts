import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Adds a reveal class and toggles `.is-visible` when the element scrolls into view.
 * Usage: <div appReveal>, <div appReveal="mask" [revealDelay]="120">
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.reveal]': "appReveal() === '' || appReveal() === 'up'",
    '[class.reveal-mask]': "appReveal() === 'mask'",
    '[class.reveal-line]': "appReveal() === 'line'",
    '[style.--d]': 'revealDelay() + "ms"',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly appReveal = input<'' | 'up' | 'mask' | 'line'>('');
  readonly revealDelay = input(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const node = this.el.nativeElement as HTMLElement;
    if (!('IntersectionObserver' in window)) {
      node.classList.add('is-visible');
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    // A fully clipped element never reports as intersecting, so mask reveals watch their parent.
    const target = this.appReveal() === 'mask' && node.parentElement ? node.parentElement : node;
    this.observer.observe(target);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
