# Nota Técnica — Sentinel

> Decisões de arquitetura, trade-offs e melhorias futuras.

---

## Visão Geral

Este documento descreve as principais decisões de engenharia tomadas durante o desenvolvimento do Sentinel, o raciocínio por trás de cada escolha, seus trade-offs e o que poderia ser melhorado em um ambiente de produção.

---

## Decisões de Arquitetura

### 1. NestJS como framework back-end

O NestJS foi escolhido por sua estrutura modular e opinada que impõe separação de responsabilidades por padrão. Sua abordagem baseada em decorators se integra naturalmente ao TypeScript e torna o código previsível e fácil de navegar.

O sistema de módulos também se alinha bem com design orientado a domínio — cada feature (incidents, health) vive em seu próprio módulo isolado com responsabilidades claramente definidas.

### 2. Prisma como ORM

O Prisma foi escolhido pelo seu query builder type-safe, suporte de primeira classe ao TypeScript e excelente experiência de desenvolvimento. A abordagem schema-first faz do modelo de dados a fonte da verdade, e o client gerado elimina toda uma categoria de erros de tipo em tempo de execução.

O Prisma 7 com o driver adapter `@prisma/adapter-pg` foi utilizado para aproveitar as capacidades mais modernas de gerenciamento de ciclo de vida de conexão.

### 3. PostgreSQL

O PostgreSQL é um banco de dados relacional robusto e battle-tested, bem adequado para dados estruturados de incidentes. A imposição estrita de schema no nível do banco (enums, foreign keys, cascades) adiciona uma camada extra de integridade dos dados além das validações no nível da aplicação.

### 4. Logs de auditoria como registros aninhados

Os logs de auditoria (`IncidentLog`) são armazenados como registros filhos de cada incidente, em vez de uma tabela global de logs separada. Essa decisão foi tomada para manter o modelo de dados simples e permitir que os logs sejam buscados em uma única query junto com os dados do incidente.

O trade-off é que essa abordagem não suporta consultas de logs entre todos os incidentes (ex: "mostrar todas as mudanças de status nas últimas 24 horas") sem uma query adicional ou uma view desnormalizada.

### 5. Sem camada de Repository

A camada de serviço interage com o Prisma diretamente, sem introduzir uma abstração de repositório. Para o escopo deste projeto, adicionar uma camada de repositório seria over-engineering — adicionaria indireção sem benefício real.

Em uma base de código maior em produção, o repository pattern se justificaria para facilitar testes unitários via mocking e para desacoplar a lógica de domínio da camada de persistência.

### 6. UpdateStatusDto separado do UpdateIncidentDto

As transições de status são uma operação distinta das atualizações de dados e são intencionalmente tratadas por um endpoint dedicado (`PATCH /incidents/:id/status`) com seu próprio DTO. Isso evita que o status seja alterado arbitrariamente como parte de uma atualização genérica e torna a intenção de cada operação explícita.

### 7. Filtro global de exceções

Um único `HttpExceptionFilter` captura todas as exceções na fronteira da aplicação. Isso garante que:

- Todos os erros retornem uma estrutura JSON consistente.
- Erros internos (ex: erros do Prisma, exceções não tratadas) sejam registrados no servidor sem vazar stack traces para o cliente.
- O cliente sempre receba um payload normalizado com `statusCode`, `path`, `method`, `timestamp` e `error`.

### 8. Validação de entrada com class-validator + class-transformer

Todos os dados de entrada são validados via DTOs decorados com regras do `class-validator`. O `ValidationPipe` é configurado globalmente com:

- `whitelist: true` — remove propriedades desconhecidas.
- `forbidNonWhitelisted: true` — rejeita requisições com campos inesperados.
- `transform: true` — transforma automaticamente os payloads em instâncias tipadas do DTO.

Decorators `@Transform` são aplicados seletivamente para normalizar entradas de texto (trim de espaços, lowercase na categoria) antes da validação ser executada.

---

## Trade-offs

| Decisão                          | Benefício                                         | Trade-off                                                        |
|----------------------------------|---------------------------------------------------|------------------------------------------------------------------|
| Sem camada de repository         | Menos boilerplate, desenvolvimento mais rápido    | Mais difícil de testar o service em isolamento                   |
| Logs aninhados por incidente     | Query única para incidente + histórico            | Não permite consultar logs globalmente sem queries adicionais    |
| Sem autenticação                 | Escopo mais simples para o teste técnico          | Todos os endpoints são publicamente acessíveis                   |
| `cuid()` como chave primária     | URL-safe, não sequencial, resistente a colisões   | Ligeiramente maior que UUID, menos portável entre ferramentas    |
| Driver adapter (@prisma/adapter-pg) | Ciclo de vida de conexão explícito, pooling futuro | Introduz uma dependência adicional na configuração do Prisma em comparação ao modelo tradicional.           |

---

## Possíveis Melhorias Futuras

### Curto prazo

- **Autenticação e Autorização** — Introduzir autenticação JWT com controle de acesso baseado em papéis (ex: apenas o responsável ou um admin pode fechar um incidente).
- **Paginação** — O endpoint `GET /incidents` atualmente retorna todos os registros. Paginação baseada em cursor ou offset seria necessária em escala.
- **Endpoint global de logs** — Um endpoint `GET /logs` com filtros por ação, intervalo de datas e `incidentId` melhoraria a observabilidade.
- **Validação de transições de status** — Impor transições válidas de máquina de estados (ex: `CLOSED` → `OPEN` deveria ser rejeitado) em vez de permitir qualquer mudança de status.

### Médio prazo

- **Arquitetura orientada a eventos** — Emitir eventos de domínio (ex: `IncidentCreated`, `IncidentStatusChanged`) via event bus (NestJS EventEmitter ou um message broker como RabbitMQ) para desacoplar efeitos colaterais como notificações de integrações externas do serviço principal.
- **Cache** — Introduzir cache com Redis para incidentes frequentemente acessados, reduzindo a carga no banco de dados.
- **Rate limiting** — Aplicar limitação de requisições por IP ou por usuário nos endpoints de escrita para evitar abusos.

### Longo prazo

- **Repository pattern** — Introduzir uma camada de abstração de repositório para desacoplar a lógica do serviço do Prisma, facilitando a troca da camada de persistência e os testes unitários em isolamento.
- **Observabilidade** — Integrar logging estruturado (ex: Pino) com uma plataforma de agregação de logs (Datadog, Grafana Loki) e rastreamento distribuído (OpenTelemetry).
- **Pipeline de CI/CD** — Automatizar testes, linting e deploy via GitHub Actions com promoção por ambiente (staging → produção).