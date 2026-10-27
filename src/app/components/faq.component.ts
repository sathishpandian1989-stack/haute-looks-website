import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { IconComponent } from '../shared/icon.component';
import { RevealDirective } from '../shared/reveal.directive';
import { FAQS } from '../core/content';

@Component({
  selector: 'app-faq',
  imports: [IconComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="faq">
      @for (f of items(); track f.q; let i = $index) {
        <div class="faq__item" [class.is-open]="open() === i" appReveal [revealDelay]="i * 60">
          <h3>
            <button
              type="button"
              [id]="'faq-q-' + i"
              [attr.aria-expanded]="open() === i"
              [attr.aria-controls]="'faq-a-' + i"
              (click)="toggle(i)"
            >
              <span class="faq__n">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <span class="faq__q">{{ f.q }}</span>
              <span class="faq__icon"><app-icon name="plus" /></span>
            </button>
          </h3>
          <div class="faq__a" [id]="'faq-a-' + i" role="region" [attr.aria-labelledby]="'faq-q-' + i">
            <div><p>{{ f.a }}</p></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .faq {
      border-top: 1px solid var(--gold-line);
    }
    .faq__item {
      border-bottom: 1px solid var(--gold-line);
    }
    h3 {
      font-family: var(--font-body);
      font-weight: 600;
    }
    button {
      width: 100%;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: clamp(14px, 3vw, 32px);
      align-items: center;
      padding: 26px 0;
      background: none;
      border: 0;
      text-align: left;
      cursor: pointer;
    }
    .faq__n {
      font-size: 12px;
      letter-spacing: 0.2em;
    }
    .faq__q {
      font-family: var(--font-display);
      font-size: clamp(1.35rem, 2.4vw, 1.9rem);
      font-weight: 500;
      line-height: 1.2;
    }
    .faq__icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--gold-line);
      border-radius: 50%;
      transition: transform 0.5s var(--ease-out), background 0.3s, color 0.3s;
    }
    .faq__icon app-icon {
      width: 18px;
      height: 18px;
    }
    .is-open .faq__icon {
      transform: rotate(135deg);
      background: var(--color-gold);
      color: var(--color-black);
    }
    .faq__a {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.6s var(--ease-cinema);
    }
    .faq__a > div {
      overflow: hidden;
    }
    .is-open .faq__a {
      grid-template-rows: 1fr;
    }
    .faq__a p {
      margin: 0;
      padding: 0 56px 28px clamp(40px, 6vw, 64px);
      max-width: 72ch;
    }
    .faq__item:not(.is-open) .faq__a {
      visibility: hidden;
      transition: grid-template-rows 0.6s var(--ease-cinema), visibility 0s 0.6s;
    }
  `,
})
export class FaqComponent {
  readonly items = input(FAQS);
  protected readonly open = signal<number | null>(0);

  protected toggle(i: number): void {
    this.open.update((cur) => (cur === i ? null : i));
  }
}
