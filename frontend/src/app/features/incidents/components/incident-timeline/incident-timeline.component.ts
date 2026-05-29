import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IncidentLog } from '../../models/incident.model';

const ACTION_LABELS: Record<string, string> = {
  INCIDENT_CREATED: 'Incidente criado',
  INCIDENT_UPDATED: 'Incidente atualizado',
  INCIDENT_STATUS_CHANGED: 'Status alterado',
  INCIDENT_DELETED: 'Incidente removido',
};

@Component({
  selector: 'app-incident-timeline',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './incident-timeline.component.html',
  styleUrl: './incident-timeline.component.scss',
})
export class IncidentTimelineComponent {
  @Input({ required: true }) logs: IncidentLog[] = [];

  getActionLabel(action: string): string {
    return ACTION_LABELS[action] ?? action;
  }
}