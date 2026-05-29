import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading">
      <div class="spinner"></div>
      <p>{{ label }}</p>
    </div>
  `,
  styles: [`
    .loading {
      display: grid;
      place-items: center;
      gap: 14px;
      padding: 64px;
      color: var(--muted);
    }

    .spinner {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      border: 3px solid rgba(255,255,255,.12);
      border-top-color: #8b5cf6;
      animation: spin .8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingStateComponent {
  @Input() label = 'Loading...';
}
