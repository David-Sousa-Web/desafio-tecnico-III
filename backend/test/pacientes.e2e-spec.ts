import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/shared/filters/global-exception.filter';
import { DataSource } from 'typeorm';

describe('PacientesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM exames');
    await dataSource.query('DELETE FROM pacientes');
  });

  describe('POST /pacientes', () => {
    it('should create a new paciente with valid data (201)', async () => {
      const createDto = {
        nome: 'João Silva',
        dataNascimento: '1990-05-15',
        documento: '12345678901',
      };

      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe(createDto.nome);
      expect(response.body.documento).toBe(createDto.documento);
      expect(response.body.dataNascimento).toBe(createDto.dataNascimento);
    });

    it('should return 409 when documento already exists', async () => {
      const createDto = {
        nome: 'João Silva',
        dataNascimento: '1990-05-15',
        documento: '12345678901',
      };

      await request(app.getHttpServer())
        .post('/pacientes')
        .send(createDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send({
          ...createDto,
          nome: 'Maria Santos',
        })
        .expect(409);

      expect(response.body.statusCode).toBe(409);
      expect(response.body.message).toContain('documento');
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send({})
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeInstanceOf(Array);
    });

    it('should return 400 when nome is too short', async () => {
      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send({
          nome: 'J',
          dataNascimento: '1990-05-15',
          documento: '12345678901',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 when dataNascimento is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/pacientes')
        .send({
          nome: 'João Silva',
          dataNascimento: 'invalid-date',
          documento: '12345678901',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });
  });

  describe('GET /pacientes', () => {
    it('should return paginated list of pacientes', async () => {
      const pacientes = [
        { nome: 'Paciente 1', dataNascimento: '1990-01-01', documento: '11111111111' },
        { nome: 'Paciente 2', dataNascimento: '1985-06-15', documento: '22222222222' },
        { nome: 'Paciente 3', dataNascimento: '1978-12-30', documento: '33333333333' },
      ];

      for (const paciente of pacientes) {
        await request(app.getHttpServer())
          .post('/pacientes')
          .send(paciente);
      }

      const response = await request(app.getHttpServer())
        .get('/pacientes')
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
      expect(response.body.totalPages).toBe(1);
    });

    it('should return correct pagination when pageSize is smaller than total', async () => {
      for (let i = 1; i <= 5; i++) {
        await request(app.getHttpServer())
          .post('/pacientes')
          .send({
            nome: `Paciente ${i}`,
            dataNascimento: '1990-01-01',
            documento: `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`,
          });
      }

      const response = await request(app.getHttpServer())
        .get('/pacientes')
        .query({ page: 1, pageSize: 2 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(5);
      expect(response.body.totalPages).toBe(3);
    });

    it('should return empty list when no pacientes exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/pacientes')
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should use default pagination values when not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/pacientes')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
    });
  });
});

