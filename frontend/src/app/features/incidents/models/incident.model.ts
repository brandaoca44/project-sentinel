export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IncidentLog {
  id: string;
  incidentId: string;
  action: string;
  message: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  assignee: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  logs: IncidentLog[];
}

export interface CreateIncidentPayload {
  title: string;
  description: string;
  category: string;
  assignee: string;
  priority: IncidentPriority;
}

export interface UpdateIncidentPayload {
  title?: string;
  description?: string;
  category?: string;
  assignee?: string;
  priority?: IncidentPriority;
  status?: IncidentStatus;
}

export interface IncidentFilters {
  status?: IncidentStatus | '';
  priority?: IncidentPriority | '';
  category?: string;
}
