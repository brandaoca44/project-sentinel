import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/incidents/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'incidents/new',
    loadComponent: () =>
      import('./features/incidents/pages/create-incident/create-incident.component').then(
        (m) => m.CreateIncidentComponent,
      ),
  },
  {
    path: 'incidents/:id',
    loadComponent: () =>
      import('./features/incidents/pages/incident-details/incident-details.component').then(
        (m) => m.IncidentDetailsComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
