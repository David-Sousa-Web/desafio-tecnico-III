import { Routes } from '@angular/router';
import { PacientesListComponent } from './pacientes-list/pacientes-list.component';

export const PACIENTES_ROUTES: Routes = [
  {
    path: '',
    component: PacientesListComponent,
  },
];

