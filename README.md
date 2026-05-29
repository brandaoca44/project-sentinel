# Sentinel — Plataforma de Gerenciamento de Incidentes

> Plataforma moderna para registro, acompanhamento e auditoria de incidentes de ponta a ponta.

---

## Índice

- [Visão Geral](#visão-geral)
- [Features](#features)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Logs de Auditoria](#logs-de-auditoria)
- [Testes](#testes)
- [Scripts Úteis](#scripts-úteis)
- [Documentação Adicional](#documentação-adicional)

---

## Visão Geral

Sentinel é uma plataforma de gerenciamento de incidentes desenvolvida como teste técnico. Demonstra uma implementação completa de ponta a ponta envolvendo design de API REST, persistência em banco de dados, logs de auditoria, validação de entrada, tratamento de erros e documentação de API.

---

## Features

- Criação de incidentes
- Atualização de incidentes
- Fluxo de status dos incidentes
- Timeline de auditoria
- Filtros por status, prioridade e categoria
- Endpoint de monitoramento (Health Check)
- Documentação Swagger
- Tratamento global de exceções
- Dashboard Angular
- Página de detalhes do incidente

---

## Tecnologias

### Back-end

| Camada         | Tecnologia                          |
|----------------|-------------------------------------|
| Framework      | NestJS                              |
| Linguagem      | TypeScript                          |
| ORM            | Prisma 7                            |
| Banco de dados | PostgreSQL 16                       |
| Validação      | class-validator + class-transformer |
| Documentação   | Swagger (OpenAPI)                   |
| Driver DB      | @prisma/adapter-pg                  |
| Container      | Docker + Docker Compose             |

### Front-end

| Camada        | Tecnologia             |
|---------------|------------------------|
| Framework     | Angular 21             |
| Linguagem     | TypeScript             |
| Estilização   | SCSS                   |
| Formulários   | Reactive Forms         |
| HTTP          | HttpClient             |
| Roteamento    | Angular Router         |

---

## Estrutura do Projeto

```
sentinel/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   └── filters/              # Filtro global de exceções
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── incidents/            # Módulo principal de incidentes
│   │   │   │   ├── dto/              # CreateIncidentDto, UpdateIncidentDto, QueryIncidentsDto, UpdateStatusDto
│   │   │   │   ├── incidents.controller.ts
│   │   │   │   ├── incidents.service.ts
│   │   │   │   ├── incidents.module.ts
│   │   │   │   ├── incidents.controller.spec.ts
│   │   │   │   └── incidents.service.spec.ts
│   │   │   └── health/               # Endpoint de health check
│   │   │       ├── health.controller.ts
│   │   │       └── health.module.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── test/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── interceptors/     # Interceptor global de erros HTTP
│   │   │   ├── shared/
│   │   │   │   └── components/       # Shell, LoadingState, EmptyState
│   │   │   ├── features/
│   │   │   │   └── incidents/
│   │   │   │       ├── components/   # IncidentCard, IncidentForm, IncidentFilters, Badges, Timeline
│   │   │   │       ├── models/       # Interfaces e tipos
│   │   │   │       ├── pages/        # Dashboard, CreateIncident, IncidentDetails
│   │   │   │       └── services/     # IncidentsService
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   └── styles.scss
│   └── package.json
│
├── docs/
│   ├── incident-analysis.md
│   └── technical-note.md
├── docker-compose.yml
└── README.md
```

---

## Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) + Docker Compose
- npm >= 10

---

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd sentinel
```

---

### 2. Subir o banco de dados

```bash
docker compose up -d
```

O PostgreSQL ficará disponível em:

```
Host:     localhost
Porta:    5433
Banco:    sentinel_db
Usuário:  sentinel
Senha:    sentinel123
```

---

### 3. Configurar variáveis de ambiente

Dentro da pasta `backend/`, crie o arquivo `.env` com base no exemplo fornecido:

```bash
cp backend/.env.example backend/.env
```

Conteúdo do `.env`:

```env
DATABASE_URL="postgresql://sentinel:sentinel123@localhost:5433/sentinel_db?schema=public"
PORT=3333
```

---

### 4. Instalar dependências e iniciar o back-end

```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

| Recurso      | URL                              |
|--------------|----------------------------------|
| Base da API  | http://localhost:3333/api        |
| Swagger UI   | http://localhost:3333/docs       |
| Health check | http://localhost:3333/api/health |

---

### 5. Instalar dependências e iniciar o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm start
```

| Recurso      | URL                      |
|--------------|--------------------------|
| Aplicação    | http://localhost:4200    |

---

## Variáveis de Ambiente

| Variável       | Descrição                          | Padrão                                                                       |
|----------------|------------------------------------|------------------------------------------------------------------------------|
| `DATABASE_URL` | String de conexão com o PostgreSQL | `postgresql://sentinel:sentinel123@localhost:5433/sentinel_db?schema=public` |
| `PORT`         | Porta HTTP da API                  | `3333`                                                                       |

---

## Endpoints da API

Todos os endpoints são prefixados com `/api` e estão documentados no Swagger UI em `/docs`.

### Health

| Método | Endpoint    | Descrição           |
|--------|-------------|---------------------|
| GET    | /api/health | Health check da API |

---

### Incidentes

| Método | Endpoint                  | Descrição                     |
|--------|---------------------------|-------------------------------|
| POST   | /api/incidents            | Criar um novo incidente       |
| GET    | /api/incidents            | Listar incidentes com filtros |
| GET    | /api/incidents/:id        | Buscar incidente por ID       |
| PATCH  | /api/incidents/:id        | Atualizar dados do incidente  |
| PATCH  | /api/incidents/:id/status | Atualizar status do incidente |
| DELETE | /api/incidents/:id        | Remover um incidente          |

---

### Exemplos de Requisição

#### POST /api/incidents

```json
{
  "title": "Instabilidade na conexão com o banco de dados",
  "description": "Usuários estão enfrentando falhas intermitentes de conexão durante a autenticação.",
  "category": "infraestrutura",
  "assignee": "Caíque Brandão",
  "priority": "HIGH"
}
```

#### PATCH /api/incidents/:id/status

```json
{
  "status": "IN_PROGRESS"
}
```

#### PATCH /api/incidents/:id

```json
{
  "title": "Instabilidade na conexão com o banco de dados resolvida",
  "priority": "CRITICAL"
}
```

---

### Filtros de Consulta — GET /api/incidents

| Parâmetro  | Tipo               | Descrição              |
|------------|--------------------|------------------------|
| `status`   | `IncidentStatus`   | Filtrar por status     |
| `priority` | `IncidentPriority` | Filtrar por prioridade |
| `category` | `string`           | Filtrar por categoria  |

**Valores disponíveis:**

```
status:   OPEN | IN_PROGRESS | RESOLVED | CLOSED
priority: LOW  | MEDIUM      | HIGH     | CRITICAL
```

---

## Logs de Auditoria

Cada incidente mantém um histórico de auditoria gerado automaticamente. Cada operação registra uma entrada de log com as seguintes ações:

| Ação                      | Disparada por                   |
|---------------------------|---------------------------------|
| `INCIDENT_CREATED`        | POST /api/incidents             |
| `INCIDENT_UPDATED`        | PATCH /api/incidents/:id        |
| `INCIDENT_STATUS_CHANGED` | PATCH /api/incidents/:id/status |

Os logs são retornados aninhados na resposta do incidente, ordenados por `createdAt` decrescente.

---

## Testes

```bash
# Testes unitários
cd backend
npm run test

# Testes em modo watch
npm run test:watch

# Relatório de cobertura
npm run test:cov
```

---

## Scripts Úteis

### Back-end

```bash
npm run start:dev    # Iniciar em modo desenvolvimento (hot reload)
npm run build        # Build para produção
npm run start:prod   # Iniciar em modo produção
npm run test         # Rodar testes
npx prisma migrate dev  # Executar migrations
npx prisma studio    # Abrir visualizador do banco
```

### Front-end

```bash
npm start            # Iniciar em modo desenvolvimento
npm run build        # Build para produção
npm run test         # Rodar testes
```

---

## Documentação Adicional

A pasta `docs/` contém documentos complementares:

| Arquivo                     | Descrição                                                             |
|-----------------------------|-----------------------------------------------------------------------|
| `docs/technical-note.md`    | Decisões de arquitetura, trade-offs e melhorias futuras               |
| `docs/incident-analysis.md` | Análise de cenário de incidente com causa raiz e medidas de prevenção |

---

## Autor

Caique César Moreira Cruz Brandão

GitHub: github.com/brandaoca44  
LinkedIn: linkedin.com/in/caique-brandão-47319537b