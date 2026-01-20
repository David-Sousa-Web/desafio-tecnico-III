# Medical System - Frontend

Frontend Angular para cadastro de pacientes e exames médicos.

## Tecnologias

- Angular 21
- PrimeNG
- TypeScript

## Requisitos

- Node.js 20+
- npm

## Como Rodar

### 1. Instalar dependências

```bash
cd frontend
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm start
```

A aplicação estará disponível em: `http://localhost:4200`

### 3. Build para produção

```bash
npm run build
```

## Estrutura

```
src/app/
├── core/
│   ├── models/       # Interfaces e tipos
│   ├── services/     # Services HTTP
│   └── interceptors/ # Interceptor de erros
├── features/
│   ├── pacientes/    # Módulo de pacientes
│   └── exames/       # Módulo de exames
└── shared/           # Componentes compartilhados
```

## Funcionalidades

- Listagem paginada de pacientes
- Cadastro de pacientes com validação
- Listagem paginada de exames
- Cadastro de exames com modalidades DICOM
- Tratamento de erros com botão "Tentar novamente"
- Loading states com skeleton
