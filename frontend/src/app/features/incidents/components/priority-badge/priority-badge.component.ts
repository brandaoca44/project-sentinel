import { Component, Input } from '@angular/core';
import { IncidentPriority } from '../../models/incident.model';

const PRIORITY_LABELS: Record<IncidentPriority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  template: `
    <span class="badge" [class]="priority.toLowerCase()">
      <span class="indicator"></span>
      {{ PRIORITY_LABELS[priority] }}
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
      box-shadow: 0 0 0 5px color-mix(in srgb, currentColor 12%, transparent);
    }

    .low {
      color: #93c5fd;
      background: rgba(59,130,246,.10);
      border-color: rgba(59,130,246,.18);
    }

    .medium {
      color: #fde68a;
      background: rgba(250,204,21,.10);
      border-color: rgba(250,204,21,.18);
    }

    .high {
      color: #fdba74;
      background: rgba(251,146,60,.12);
      border-color: rgba(251,146,60,.20);
    }

    .critical {
      color: #fecdd3;
      background:
        linear-gradient(
          135deg,
          rgba(244,63,94,.24),
          rgba(124,58,237,.10)
        );
      border-color: rgba(244,63,94,.35);
      box-shadow: 0 0 0 1px rgba(244,63,94,.12);
    }
  `],
})
export class PriorityBadgeComponent {
  @Input({ required: true }) priority!: IncidentPriority;

  protected readonly PRIORITY_LABELS = PRIORITY_LABELS;
}