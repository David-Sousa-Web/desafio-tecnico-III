import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';

import { PacientesService } from '../../../core/services';

@Component({
  selector: 'app-pacientes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    InputMaskModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-field">
        <label for="nome">Nome *</label>
        <input
          pInputText
          id="nome"
          formControlName="nome"
          placeholder="Nome completo"
          style="width: 100%"
        />
        @if (submitted() && form.get('nome')?.invalid) {
          <small class="error">Nome é obrigatório (mínimo 2 caracteres)</small>
        }
      </div>

      <div class="form-field">
        <label for="documento">Documento (CPF) *</label>
        <p-inputmask
          id="documento"
          formControlName="documento"
          mask="999.999.999-99"
          placeholder="000.000.000-00"
          styleClass="w-full"
        />
        @if (submitted() && form.get('documento')?.invalid) {
          <small class="error">Documento é obrigatório</small>
        }
      </div>

      <div class="form-field">
        <label for="dataNascimento">Data de Nascimento *</label>
        <p-datepicker
          id="dataNascimento"
          formControlName="dataNascimento"
          dateFormat="dd/mm/yy"
          placeholder="Selecione a data"
          [showIcon]="true"
          styleClass="w-full"
          appendTo="body"
        />
        @if (submitted() && form.get('dataNascimento')?.invalid) {
          <small class="error">Data de nascimento é obrigatória</small>
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
export class PacientesFormComponent {
  saved = output<void>();
  cancelled = output<void>();

  loading = signal(false);
  submitted = signal(false);
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pacientesService: PacientesService,
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      documento: ['', [Validators.required]],
      dataNascimento: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) return;

    this.loading.set(true);

    const formValue = this.form.value;
    const documento = formValue.documento.replace(/\D/g, '');
    const dataNascimento = this.formatDate(formValue.dataNascimento);

    this.pacientesService
      .create({
        nome: formValue.nome,
        documento,
        dataNascimento,
      })
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

