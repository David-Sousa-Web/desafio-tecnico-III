import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain.exception';

export class DuplicateEntityException extends DomainException {
  constructor(entityName: string, field: string, value: string) {
    super(
      `${entityName} com ${field} '${value}' já existe`,
      HttpStatus.CONFLICT,
    );
  }
}

