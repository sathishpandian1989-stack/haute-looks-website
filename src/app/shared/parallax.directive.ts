import { Directive, ElementRef, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject, input, numberAttribute } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Lightweight scroll parallax for images. Disabled for reduced-motion users and on
 * narrow screens, and runs outside Angular change detection for performance.
 */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective implements OnInit, OnDestroy {
  readonly appParallax = input(0.12, { transform: (v: unknown) => numberAttribute(v, 0.12) });

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private frame = 0;
  private readonly onScroll = () => {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.update());
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || window.innerWidth < 768) return;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.update();
    });
  }

  private update(): void {
    const node = this.el.nativeElement as HTMLElement;
    const rect = node.parentElement?.getBoundingClientRect() ?? node.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -this.appParallax();
    node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.12)`;
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
    cancelAnimationFrame(this.frame);
  }
}
