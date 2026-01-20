import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ExamesService } from '../../application/services/exames.service';
import { CreateExameDto } from '../dto/create-exame.dto';
import { ExameResponseDto } from '../dto/exame-response.dto';
import { PaginationQueryDto } from '../../../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../../shared/dto/paginated-response.dto';

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  async create(
    @Body() dto: CreateExameDto,
    @Res() response: Response,
  ): Promise<Response<ExameResponseDto>> {
    const result = await this.examesService.create(dto);

    const statusCode = result.isNew ? HttpStatus.CREATED : HttpStatus.OK;
    return response.status(statusCode).json(result.exame);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ExameResponseDto>> {
    return this.examesService.findAll(pagination);
  }
}

