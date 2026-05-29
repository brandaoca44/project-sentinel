import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { IncidentFormComponent } from '../../components/incident-form/incident-form.component';
import { CreateIncidentPayload } from '../../models/incident.model';
import { IncidentsService } from '../../services/incidents.service';

@Component({
  standalone: true,
  imports: [RouterLink, IncidentFormComponent],
  templateUrl: './create-incident.component.html',
  styleUrl: './create-incident.component.scss',
})
export class CreateIncidentComponent {
  private readonly incidentsService = inject(IncidentsService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly error = signal('');

  createIncident(payload: CreateIncidentPayload): void {
    this.isSubmitting.set(true);
    this.error.set('');

    this.incidentsService
      .create(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (incident) => this.router.navigate(['/incidents', incident.id]),
        error: (error: Error) => this.error.set(error.message),
      });
  }
}
