import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Paciente,
  CreatePacienteDto,
  PaginatedResponse,
  PaginationParams,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private readonly endpoint = '/pacientes';

  constructor(private api: ApiService) {}

  getAll(params: PaginationParams): Observable<PaginatedResponse<Paciente>> {
    return this.api.get<PaginatedResponse<Paciente>>(this.endpoint, {
      page: params.page,
      pageSize: params.pageSize,
    });
  }

  create(dto: CreatePacienteDto): Observable<Paciente> {
    return this.api.post<Paciente>(this.endpoint, dto);
  }
}

