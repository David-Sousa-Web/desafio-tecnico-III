import { Component, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { ExamesService, PacientesService } from '../../../core/services';
import { Paciente, MODALIDADES_OPTIONS, Modalidade } from '../../../core/models';

@Component({
  selector: 'app-exames-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="pacienteId">Paciente *</label>
        <p-select
          id="pacienteId"
          formControlName="pacienteId"
          [options]="pacientes()"
          optionLabel="nome"
          optionValue="id"
          placeholder="Selecione um paciente"
          [filter]="true"
          filterPlaceholder="Buscar paciente"
          styleClass="w-full"
          [loading]="loadingPacientes()"
          appendTo="body"
        />
        @if (submitted() && form.get('pacienteId')?.invalid) {
          <small class="error">Paciente é obrigatório</small>
        }
      </div>

      <div class="form-field">
        <label for="modalidade">Modalidade DICOM *</label>
        <p-select
          id="modalidade"
          formControlName="modalidade"
          [options]="modalidades"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecione a modalidade"
          styleClass="w-full"
          appendTo="body"
        />
        @if (submitted() && form.get('modalidade')?.invalid) {
          <small class="error">Modalidade é obrigatória</small>
        }
      </div>

      <div class="form-field">
        <label for="dataExame">Data do Exame *</label>
        <p-datepicker
          id="dataExame"
          formControlName="dataExame"
          dateFormat="dd/mm/yy"
          placeholder="Selecione a data"
          [showIcon]="true"
          styleClass="w-full"
          appendTo="body"
        />
        @if (submitted() && form.get('dataExame')?.invalid) {
          <small class="error">Data do exame é obrigatória</small>
        }
      </div>

      <div class="form-actions">
        <p-button
          label="Cancelar"
          severity="secondary"
          [outlined]="true"
          (onClick)="onCancel()"
        />
        <p-button
          label="Salvar"
          type="submit"
          [loading]="loading()"
        />
      </div>
    </form>
  `,
  styles: [`
    :host ::ng-deep .w-full {
      width: 100%;
    }
  `],
})
export class ExamesFormComponent implements OnInit {
  saved = output<void>();
  cancelled = output<void>();

  loading = signal(false);
  loadingPacientes = signal(false);
  submitted = signal(false);
  pacientes = signal<Paciente[]>([]);
  modalidades = MODALIDADES_OPTIONS;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private examesService: ExamesService,
    private pacientesService: PacientesService,
  ) {
    this.form = this.fb.group({
      pacienteId: [null, [Validators.required]],
      modalidade: [null, [Validators.required]],
      dataExame: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loadingPacientes.set(true);
    this.pacientesService.getAll({ page: 1, pageSize: 100 }).subscribe({
      next: (response) => {
        this.pacientes.set(response.data);
        this.loadingPacientes.set(false);
      },
      error: () => {
        this.loadingPacientes.set(false);
      },
    });
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) return;

    this.loading.set(true);

    const formValue = this.form.value;
    const dataExame = this.formatDate(formValue.dataExame);

    this.examesService
      .create(formValue.pacienteId, formValue.modalidade as Modalidade, dataExame)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.resetForm();
          this.saved.emit();
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.form.reset();
    this.submitted.set(false);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

