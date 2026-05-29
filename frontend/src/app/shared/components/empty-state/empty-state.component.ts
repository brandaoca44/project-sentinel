import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="empty">
      <div class="icon">⌁</div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      @if (link) {
        <a [routerLink]="link">{{ actionLabel }}</a>
      }
    </section>
  `,
  styles: [`
    .empty {
      padding: 54px;
      text-align: center;
      border: 1px solid var(--border);
      border-radius: 28px;
      background: rgba(255,255,255,.035);
    }

    .icon {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background: rgba(124,58,237,.14);
      color: #c4b5fd;
      font-size: 28px;
    }

    h3 { margin: 0 0 8px; }
    p { color: var(--muted); margin: 0 0 22px; }

    a {
      display: inline-flex;
      color: white;
      text-decoration: none;
      padding: 11px 16px;
      border-radius: 14px;
      background: linear-gradient(135deg, #7c3aed, #0891b2);
    }
  `],
})
export class EmptyStateComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) description = '';
  @Input() link = '';
  @Input() actionLabel = 'Create incident';
}
