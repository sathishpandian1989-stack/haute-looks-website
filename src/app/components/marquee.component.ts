import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../shared/icon.component';

/** Slow editorial ticker band. Pauses on hover; static for reduced-motion users. */
@Component({
  selector: 'app-marquee',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mq" [class.mq--gold]="gold()" aria-hidden="true">
      <div class="mq__track">
        @for (copy of [0, 1]; track copy) {
          <div class="mq__group">
            @for (w of words(); track $index) {
              <span class="mq__word">{{ w }}</span>
              <span class="mq__sep"><app-icon name="sparkles" /></span>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .mq {
      overflow: hidden;
      border-block: 1px solid var(--gold-line);
      padding: 22px 0;
    }
    .mq--gold {
      background: var(--color-gold);
      color: var(--color-black);
      border-color: var(--color-gold);
    }
    .mq__track {
      display: flex;
      width: max-content;
      animation: mq 38s linear infinite;
    }
    .mq:hover .mq__track {
      animation-play-state: paused;
    }
    .mq__group {
      display: flex;
      align-items: center;
    }
    .mq__word {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 4vw, 3.2rem);
      font-style: italic;
      padding: 0 28px;
      white-space: nowrap;
    }
    .mq__sep app-icon {
      width: 22px;
      height: 22px;
    }
    @keyframes mq {
      to {
        transform: translateX(-50%);
      }
    }
  `,
})
export class MarqueeComponent {
  readonly words = input<string[]>(['Hair', 'Skin', 'Makeup', 'Bridal', 'Grooming', 'Colour']);
  readonly gold = input(false);
}
