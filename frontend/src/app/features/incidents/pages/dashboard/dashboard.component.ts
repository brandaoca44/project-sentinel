import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Incident, IncidentFilters } from '../../models/incident.model';
import { IncidentsService } from '../../services/incidents.service';
import { IncidentCardComponent } from '../../components/incident-card/incident-card.component';
import { IncidentFiltersComponent } from '../../components/incident-filters/incident-filters.component';
import { LoadingStateComponent } from '@shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    IncidentCardComponent,
    IncidentFiltersComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly incidentsService = inject(IncidentsService);

  readonly incidents = signal<Incident[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal('');

  readonly total = computed(() => this.incidents().length);
  readonly open = computed(() => this.incidents().filter((item) => item.status === 'OPEN').length);
  readonly inProgress = computed(() => this.incidents().filter((item) => item.status === 'IN_PROGRESS').length);
  readonly critical = computed(() => this.incidents().filter((item) => item.priority === 'CRITICAL').length);
  readonly resolved = computed(() => this.incidents().filter((item) => item.status === 'RESOLVED').length);

  ngOnInit(): void {
    this.load();
  }

  load(filters: IncidentFilters = {}): void {
    this.isLoading.set(true);
    this.error.set('');

    this.incidentsService
      .findAll(filters)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (incidents) => this.incidents.set(incidents),
        error: (error: Error) => this.error.set(error.message),
      });
  }
}
