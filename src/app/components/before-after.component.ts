import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { PictureComponent } from '../shared/picture.component';
import { Transformation } from '../core/content';

let uid = 0;

/**
 * Accessible before/after comparison.
 * - Pointer/touch: drag anywhere horizontally (vertical page scroll still works: touch-action pan-y)
 * - Keyboard / screen readers: native range input (arrow keys, Home/End, PageUp/PageDown)
 * - No automatic motion.
 */
@Component({
  selector: 'app-before-after',
  imports: [IconComponent, PictureComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="ba">
      <div
        #stage
        class="ba__stage"
        [style.--pos]="pos() + '%'"
        (pointerdown)="onDown($event)"
        (pointermove)="onMove($event)"
        (pointerup)="dragging = false"
        (pointercancel)="dragging = false"
      >
        <div class="ba__img ba__img--after">
          <app-picture [img]="item().after" sizes="(min-width: 1024px) 40vw, 100vw" [decorative]="false" />
        </div>
        <div class="ba__img ba__img--before" aria-hidden="true">
          <app-picture [img]="item().before" sizes="(min-width: 1024px) 40vw, 100vw" [decorative]="true" />
        </div>

        <span class="ba__tag ba__tag--before">Before</span>
        <span class="ba__tag ba__tag--after">After</span>
        @if (item().demo) {
          <span class="ba__demo">Sample</span>
        }

        <div class="ba__handle" aria-hidden="true">
          <span class="ba__knob"><app-icon name="chevrons-left-right" /></span>
        </div>

        <label class="sr-only" [for]="id">Compare before and after: {{ item().title }}</label>
        <input
          class="ba__range"
          type="range"
          [id]="id"
          min="0"
          max="100"
          step="1"
          [value]="pos()"
          (input)="onRange($event)"
          [attr.aria-valuetext]="pos() + '% before image shown'"
        />
      </div>
      <figcaption>
        <span class="micro">{{ item().label }}</span>
        <span class="ba__title">{{ item().title }}</span>
      </figcaption>
    </figure>
  `,
  styles: `
    .ba {
      margin: 0;
    }
    .ba__stage {
      position: relative;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      border: 1px solid var(--gold-line);
      cursor: ew-resize;
      touch-action: pan-y;
      user-select: none;
      -webkit-user-select: none;
    }
    .ba__img {
      position: absolute;
      inset: 0;
    }
    .ba__img ::ng-deep img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      pointer-events: none;
    }
    .ba__img--before {
      clip-path: inset(0 calc(100% - var(--pos)) 0 0);
    }
    .ba__handle {
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--pos);
      width: 1px;
      background: var(--color-gold);
      transform: translateX(-0.5px);
      pointer-events: none;
    }
    .ba__knob {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--color-gold);
      color: var(--color-black);
      transform: translate(-50%, -50%);
      transition: transform 0.3s var(--ease-out);
    }
    .ba__knob app-icon {
      width: 22px;
      height: 22px;
    }
    .ba__stage:hover .ba__knob {
      transform: translate(-50%, -50%) scale(1.08);
    }
    .ba__stage:has(.ba__range:focus-visible) .ba__knob {
      outline: 2px solid var(--color-gold);
      outline-offset: 4px;
    }
    .ba__range {
      position: absolute;
      inset: auto 0 0 0;
      width: 100%;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }
    .ba__tag,
    .ba__demo {
      position: absolute;
      top: 16px;
      padding: 6px 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      background: var(--color-black);
      color: var(--color-gold);
      border: 1px solid var(--gold-line);
      pointer-events: none;
    }
    .ba__tag--before {
      left: 16px;
    }
    .ba__tag--after {
      right: 16px;
      background: var(--color-gold);
      color: var(--color-black);
    }
    .ba__demo {
      top: auto;
      bottom: 16px;
      left: 16px;
      white-space: nowrap;
    }
    figcaption {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      padding-top: 16px;
    }
    .ba__title {
      font-family: var(--font-display);
      font-size: 1.6rem;
    }
  `,
})
export class BeforeAfterComponent {
  readonly item = input.required<Transformation>();
  protected readonly pos = signal(50);
  protected readonly id = `ba-${++uid}`;
  protected dragging = false;
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');

  protected onDown(e: PointerEvent): void {
    this.dragging = true;
    this.setFromPointer(e);
    if (e.pointerType === 'mouse') (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  protected onMove(e: PointerEvent): void {
    if (!this.dragging) return;
    this.setFromPointer(e);
  }

  protected onRange(e: Event): void {
    this.pos.set(Number((e.target as HTMLInputElement).value));
  }

  private setFromPointer(e: PointerEvent): void {
    const rect = this.stage().nativeElement.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    this.pos.set(Math.round(Math.min(100, Math.max(0, pct))));
  }
}
