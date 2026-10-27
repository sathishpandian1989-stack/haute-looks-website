import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <div class="container">
        <p class="eyebrow eyebrow--center">Error 404</p>
        <h1 class="display-1">This look <span class="italic">isn’t here.</span></h1>
        <p class="lead">The page you were looking for has moved or doesn’t exist.</p>
        <a class="btn" routerLink="/">Back to home</a>
      </div>
    </section>
  `,
  styles: `
    .nf {
      min-height: 80vh;
      display: grid;
      place-items: center;
      text-align: center;
      padding: calc(var(--header-h) + 60px) 0 80px;
    }
    .lead {
      margin: 24px auto 36px;
    }
  `,
})
export class NotFoundPage {}
