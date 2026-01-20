import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

import { ExamesService } from '../../../core/services';
import { Exame } from '../../../core/models';
import { ErrorMessageComponent, PageHeaderComponent } from '../../../shared';
import { ExamesFormComponent } from '../exames-form/exames-form.component';

@Component({
  selector: 'app-exames-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    SkeletonModule,
    DialogModule,
    ToastModule,
    TagModule,
    ErrorMessageComponent,
    PageHeaderComponent,
    ExamesFormComponent,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="container">
      <app-page-header title="Exames">
        <p-button
          label="Novo Exame"
          icon="pi pi-plus"
          (onClick)="showDialog = true"
        />
      </app-page-header>

      <div class="card">
        @if (error()) {
          <app-error-message
            [message]="error()!"
            (retry)="loadExames()"
          />
        } @else {
          <p-table
            [value]="loading() ? skeletonRows : exames()"
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
                <th>Modalidade</th>
                <th>Paciente ID</th>
                <th>Data do Exame</th>
                <th>Criado em</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-exame>
              <tr>
                @if (loading()) {
                  <td><p-skeleton width="80px" /></td>
                  <td><p-skeleton width="200px" /></td>
                  <td><p-skeleton width="100px" /></td>
                  <td><p-skeleton width="150px" /></td>
                } @else {
                  <td>
                    <p-tag [value]="exame.modalidade" severity="info" />
                  </td>
                  <td>{{ exame.pacienteId }}</td>
                  <td>{{ exame.dataExame }}</td>
                  <td>{{ exame.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                }
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center">Nenhum exame encontrado.</td>
              </tr>
            </ng-template>
          </p-table>
        }
      </div>
    </div>

    <p-dialog
      header="Novo Exame"
      [(visible)]="showDialog"
      [modal]="true"
      [style]="{ width: '450px' }"
    >
      <app-exames-form
        (saved)="onExameSaved()"
        (cancelled)="showDialog = false"
      />
    </p-dialog>
  `,
})
export class ExamesListComponent implements OnInit {
  exames = signal<Exame[]>([]);
  totalRecords = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  showDialog = false;

  pageSize = 10;
  currentPage = 1;
  skeletonRows = Array(5).fill({});

  constructor(
    private examesService: ExamesService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadExames();
  }

  loadExames(): void {
    this.loading.set(true);
    this.error.set(null);

    this.examesService
      .getAll({ page: this.currentPage, pageSize: this.pageSize })
      .subscribe({
        next: (response) => {
          this.exames.set(response.data);
          this.totalRecords.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Erro ao carregar exames.');
          this.loading.set(false);
        },
      });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.currentPage = Math.floor((event.first || 0) / this.pageSize) + 1;
    this.loadExames();
  }

  onExameSaved(): void {
    this.showDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Exame cadastrado com sucesso!',
    });
    this.loadExames();
  }
}

