import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Img } from '../core/content';

/** Responsive WebP image (640w / 1200w) with lazy loading by default. */
@Component({
  selector: 'app-picture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:contents' },
  template: `<img
    [src]="img().base + '-1200.webp'"
    [attr.srcset]="srcset()"
    [attr.sizes]="sizes()"
    [alt]="decorative() ? '' : img().alt"
    [attr.loading]="eager() ? 'eager' : 'lazy'"
    [attr.fetchpriority]="eager() ? 'high' : null"
    decoding="async"
    [attr.width]="width()"
    [attr.height]="height()"
  />`,
})
export class PictureComponent {
  readonly img = input.required<Img>();
  readonly sizes = input('(min-width: 1024px) 50vw, 100vw');
  readonly eager = input(false);
  readonly decorative = input(false);
  readonly width = input<number | null>(1200);
  readonly height = input<number | null>(1400);
  protected readonly srcset = computed(() => `${this.img().base}-640.webp 640w, ${this.img().base}-1200.webp 1200w`);
}
