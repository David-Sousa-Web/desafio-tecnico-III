import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro inesperado';

      if (error.status === 0) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Dados inválidos';
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ');
        }
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'Registro já existe';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado';
      } else if (error.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      }

      messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
        life: 5000,
      });

      return throwError(() => error);
    }),
  );
};

