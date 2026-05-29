import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Incident, IncidentStatus } from '../../models/incident.model';
import { IncidentsService } from '../../services/incidents.service';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../components/priority-badge/priority-badge.component';
import { IncidentTimelineComponent } from '../../components/incident-timeline/incident-timeline.component';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    StatusBadgeComponent,
    PriorityBadgeComponent,
    IncidentTimelineComponent,
    LoadingStateComponent,
  ],
  templateUrl: './incident-details.component.html',
  styleUrl: './incident-details.component.scss',
})
export class IncidentDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly incidentsService = inject(IncidentsService);

  readonly statuses: { value: IncidentStatus; label: string }[] = [
    { value: 'OPEN', label: 'Aberto' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'RESOLVED', label: 'Resolvido' },
    { value: 'CLOSED', label: 'Encerrado' },
  ];
  readonly incident = signal<Incident | null>(null);
  readonly isLoading = signal(true);
  readonly isUpdating = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('ID do incidente não encontrado.');
      this.isLoading.set(false);
      return;
    }

    this.incidentsService
      .findById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (incident) => this.incident.set(incident),
        error: (error: Error) => this.error.set(error.message),
      });
  }

  changeStatus(status: IncidentStatus): void {
    const current = this.incident();
    if (!current || current.status === status) return;

    this.isUpdating.set(true);
    this.error.set('');

    this.incidentsService
      .updateStatus(current.id, status)
      .pipe(finalize(() => this.isUpdating.set(false)))
      .subscribe({
        next: (incident) => this.incident.set(incident),
        error: (error: Error) => this.error.set(error.message),
      });
  }
}
