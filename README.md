# Sentinel — Plataforma de Gerenciamento de Incidentes

> Plataforma moderna para registro, acompanhamento e auditoria de incidentes de ponta a ponta.

---

## Índice

- [Visão Geral](#visão-geral)
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

Sentinel é uma plataforma de gerenciamento de incidentes desenvolvida como teste técnico. 
Demonstra uma implementação completa de ponta a ponta envolvendo design de API REST, persistência em banco de dados, logs de auditoria, validação de entrada, tratamento de erros e documentação de API.

---

## Tecnologias

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Framework    | NestJS                              |
| Linguagem    | TypeScript                          |
| ORM          | Prisma 7                            |
| Banco de dados | PostgreSQL 16                     |
| Validação    | class-validator + class-transformer |
| Documentação | Swagger (OpenAPI)                   |
| Driver DB    | @prisma/adapter-pg                  |
| Container    | Docker + Docker Compose             |

---

## Estrutura do Projeto

```
sentinel/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── filters/         # Filtro global de exceções
│   │   │  
│   │   │   
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── incidents/       # Módulo principal de incidentes
│   │   │   │   ├── dto/         # CreateIncidentDto, UpdateIncidentDto, QueryIncidentsDto, UpdateStatusDto
│   │   │   │   │ 
│   │   │   │   ├── incidents.controller.ts
│   │   │   │   ├── incidents.service.ts
│   │   │   │   ├── incidents.module.ts
│   │   │   │   ├── incidents.controller.spec
│   │   │   │   ├── incidents.service.spec
│   │   │   └── health/          # Endpoint de health check
│   │   │       │
│   │   │       ├── health.controller.ts
│   │   │       ├── health.module.ts 
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── test/
├── frontend/
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

### 4. Instalar dependências

```bash
cd backend
npm install
```

---

### 5. Executar as migrations

```bash
npx prisma migrate dev
```

> Este comando também gera o Prisma Client automaticamente.

---

### 6. Iniciar a API

```bash
npm run start:dev
```

| Recurso           | URL                               |
|-------------------|-----------------------------------|
| Base da API       | http://localhost:3333/api         |
| Swagger UI        | http://localhost:3333/docs        |
| Health check      | http://localhost:3333/api/health  |

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

| Método | Endpoint       | Descrição          |
|--------|----------------|--------------------|
| GET    | /api/health    | Health check da API |

---

### Incidentes

| Método | Endpoint                    | Descrição                          |
|--------|-----------------------------|------------------------------------|
| POST   | /api/incidents              | Criar um novo incidente            |
| GET    | /api/incidents              | Listar incidentes (com filtros)    |
| GET    | /api/incidents/:id          | Buscar incidente por ID            |
| PATCH  | /api/incidents/:id          | Atualizar dados do incidente       |
| PATCH  | /api/incidents/:id/status   | Atualizar status do incidente      |
| DELETE | /api/incidents/:id          | Remover um incidente               |

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

| Ação                      | Disparada por                      |
|---------------------------|------------------------------------|
| `INCIDENT_CREATED`        | POST /api/incidents                |
| `INCIDENT_UPDATED`        | PATCH /api/incidents/:id           |
| `INCIDENT_STATUS_CHANGED` | PATCH /api/incidents/:id/status    |

Os logs são retornados aninhados na resposta do incidente, ordenados por `createdAt` decrescente.

---

## Testes

Estrutura preparada para testes unitários e de integração utilizando Jest.

Os scripts já estão configurados e poderão ser utilizados conforme a evolução do projeto.

---

## Scripts Úteis

```bash
# Iniciar em modo desenvolvimento (hot reload)
npm run start:dev

# Build para produção
npm run build

# Iniciar em modo produção
npm run start:prod

# Executar migrations
npx prisma migrate dev

# Abrir o Prisma Studio (visualizador do banco)
npx prisma studio
```

---

## Documentação Adicional

A pasta `docs/` contém documentos complementares:

| Arquivo                       | Descrição                                                        |
|-------------------------------|------------------------------------------------------------------|
| `docs/technical-note.md`      | Decisões de arquitetura, trade-offs e melhorias futuras          |
| `docs/incident-analysis.md`   | Análise de cenário de incidente com causa raiz e medidas de prevenção |