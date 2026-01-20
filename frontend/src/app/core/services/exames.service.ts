import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ApiService } from './api.service';
import {
  Exame,
  CreateExameDto,
  Modalidade,
  PaginatedResponse,
  PaginationParams,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ExamesService {
  private readonly endpoint = '/exames';

  constructor(private api: ApiService) {}

  getAll(params: PaginationParams): Observable<PaginatedResponse<Exame>> {
    return this.api.get<PaginatedResponse<Exame>>(this.endpoint, {
      page: params.page,
      pageSize: params.pageSize,
    });
  }

  create(
    pacienteId: string,
    modalidade: Modalidade,
    dataExame: string,
  ): Observable<Exame> {
    const dto: CreateExameDto = {
      pacienteId,
      modalidade,
      dataExame,
      idempotencyKey: uuidv4(),
    };
    return this.api.post<Exame>(this.endpoint, dto);
  }
}

