import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IncidentFilters,
  IncidentPriority,
  IncidentStatus,
} from '../../models/incident.model';

@Component({
  selector: 'app-incident-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './incident-filters.component.html',
  styleUrl: './incident-filters.component.scss',
})
export class IncidentFiltersComponent {
  @Output() filtersChange = new EventEmitter<IncidentFilters>();

  readonly statuses = [
    { value: 'OPEN', label: 'Aberto' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'RESOLVED', label: 'Resolvido' },
    { value: 'CLOSED', label: 'Encerrado' },
  ] as const;

  readonly priorities = [
    { value: 'LOW', label: 'Baixa' },
    { value: 'MEDIUM', label: 'Média' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'CRITICAL', label: 'Crítica' },
  ] as const;

  filters: IncidentFilters = {
    status: '',
    priority: '',
    category: '',
  };

  emit(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  reset(): void {
    this.filters = {
      status: '',
      priority: '',
      category: '',
    };

    this.emit();
  }
}