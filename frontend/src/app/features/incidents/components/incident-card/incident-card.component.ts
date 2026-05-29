import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Incident } from '../../models/incident.model';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-incident-card',
  standalone: true,
  imports: [RouterLink, DatePipe, StatusBadgeComponent, PriorityBadgeComponent],
  templateUrl: './incident-card.component.html',
  styleUrl: './incident-card.component.scss',
})
export class IncidentCardComponent {
  @Input({ required: true }) incident!: Incident;

  get auditCount(): number {
    return this.incident.logs?.length ?? 0;
  }

  get assigneeInitial(): string {
    return this.incident.assignee?.trim().charAt(0).toUpperCase() || 'S';
  }
}