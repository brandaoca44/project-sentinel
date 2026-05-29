import { Component, Input } from '@angular/core';
import { IncidentStatus } from '../../models/incident.model';

const STATUS_LABELS: Record<IncidentStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Encerrado',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="status.toLowerCase()">
      <span class="indicator"></span>
      {{ STATUS_LABELS[status] }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 11px;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .02em;
      white-space: nowrap;
    }

    .indicator {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: currentColor;
      box-shadow:
        0 0 0 5px color-mix(in srgb, currentColor 12%, transparent);
    }

    .open {
      color: #fbbf24;
      background: rgba(251,191,36,.10);
      border-color: rgba(251,191,36,.18);
    }

    .in_progress {
      color: #60a5fa;
      background: rgba(96,165,250,.10);
      border-color: rgba(96,165,250,.18);
    }

    .resolved {
      color: #34d399;
      background: rgba(52,211,153,.10);
      border-color: rgba(52,211,153,.18);
    }

    .closed {
      color: #94a3b8;
      background: rgba(148,163,184,.10);
      border-color: rgba(148,163,184,.18);
    }
  `],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: IncidentStatus;

  protected readonly STATUS_LABELS = STATUS_LABELS;
}