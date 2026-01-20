import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <div class="error-container">
      <i class="pi pi-exclamation-circle"></i>
      <p>{{ message() }}</p>
      <p-button
        label="Tentar novamente"
        icon="pi pi-refresh"
        (onClick)="retry.emit()"
      />
    </div>
  `,
})
export class ErrorMessageComponent {
  message = input<string>('Ocorreu um erro ao carregar os dados.');
  retry = output<void>();
}

