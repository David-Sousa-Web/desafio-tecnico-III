import { HttpStatus } from '@nestjs/common';
import { DomainException } from './domain.exception';

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, identifier: string) {
    super(
      `${entityName} com identificador '${identifier}' não encontrado`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

