import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CreateIncidentPayload,
  Incident,
  IncidentFilters,
  IncidentStatus,
  UpdateIncidentPayload,
} from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/incidents`;

  findAll(filters: IncidentFilters = {}): Observable<Incident[]> {
    let params = new HttpParams();

    if (filters.status) params = params.set('status', filters.status);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.category?.trim()) params = params.set('category', filters.category.trim());

    return this.http.get<Incident[]>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Incident> {
    return this.http.get<Incident>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateIncidentPayload): Observable<Incident> {
    return this.http.post<Incident>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateIncidentPayload): Observable<Incident> {
    return this.http.patch<Incident>(`${this.baseUrl}/${id}`, payload);
  }

  updateStatus(id: string, status: IncidentStatus): Observable<Incident> {
    return this.http.patch<Incident>(`${this.baseUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
