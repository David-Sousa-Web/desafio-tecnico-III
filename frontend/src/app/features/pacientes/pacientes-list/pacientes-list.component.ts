import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { PacientesService } from '../../../core/services';
import { Paciente } from '../../../core/models';
import { ErrorMessageComponent, PageHeaderComponent } from '../../../shared';
import { PacientesFormComponent } from '../pacientes-form/pacientes-form.component';

@Component({
  selector: 'app-pacientes-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    SkeletonModule,
    DialogModule,
    ToastModule,
    ErrorMessageComponent,
    PageHeaderComponent,
    PacientesFormComponent,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="container">
      <app-page-header title="Pacientes">
        <p-button
          label="Novo Paciente"
          icon="pi pi-plus"
          (onClick)="showDialog = true"
        />
      </app-page-header>

      <div class="card">
        @if (error()) {
          <app-error-message
            [message]="error()!"
            (retry)="loadPacientes()"
          />
        } @else {
          <p-table
            [value]="loading() ? skeletonRows : pacientes()"
            [lazy]="true"
            [paginator]="true"
            [rows]="pageSize"
            [totalRecords]="totalRecords()"
            [loading]="loading()"
            (onLazyLoad)="onLazyLoad($event)"
            [tableStyle]="{ 'min-width': '50rem' }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Nome</th>
                <th>Documento</th>
                <th>Data de Nascimento</th>
                <th>Criado em</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-paciente>
              <tr>
                @if (loading()) {
                  <td><p-skeleton width="150px" /></td>
                  <td><p-skeleton width="120px" /></td>
                  <td><p-skeleton width="100px" /></td>
                  <td><p-skeleton width="150px" /></td>
                } @else {
                  <td>{{ paciente.nome }}</td>
                  <td>{{ paciente.documento }}</td>
                  <td>{{ paciente.dataNascimento }}</td>
                  <td>{{ paciente.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                }
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center">Nenhum paciente encontrado.</td>
              </tr>
            </ng-template>
          </p-table>
        }
      </div>
    </div>

    <p-dialog
      header="Novo Paciente"
      [(visible)]="showDialog"
      [modal]="true"
      [style]="{ width: '450px' }"
    >
      <app-pacientes-form
        (saved)="onPacienteSaved()"
        (cancelled)="showDialog = false"
      />
    </p-dialog>
  `,
})
export class PacientesListComponent implements OnInit {
  pacientes = signal<Paciente[]>([]);
  totalRecords = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  showDialog = false;

  pageSize = 10;
  currentPage = 1;
  skeletonRows = Array(5).fill({});

  constructor(
    private pacientesService: PacientesService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.pacientesService
      .getAll({ page: this.currentPage, pageSize: this.pageSize })
      .subscribe({
        next: (response) => {
          this.pacientes.set(response.data);
          this.totalRecords.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Erro ao carregar pacientes.');
          this.loading.set(false);
        },
      });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.currentPage = Math.floor((event.first || 0) / this.pageSize) + 1;
    this.loadPacientes();
  }

  onPacienteSaved(): void {
    this.showDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Paciente cadastrado com sucesso!',
    });
    this.loadPacientes();
  }
}

