# brev.ly

Encurtador de URL Full-Stack desenvolvido como desafio prático da formação Fundamentos Técnicos e Estratégicos (Pós Tech Developer 360 — Rocketseat).

A aplicação permite cadastrar, listar e remover links encurtados, gerar um relatório de acessos em CSV e redirecionar corretamente de um link encurtado para o link original.

## Estrutura do repositório

~~~
brev-ly/
├── server/   # Back-end + DevOps (API REST)
└── web/      # Front-end (SPA React)
~~~

## Back-end (server/)

### Tecnologias
- Node.js + TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- Zod (validação)
- AWS SDK (upload do CSV para Cloudflare R2 / S3)
- Docker

### Como rodar
~~~bash
cd server
cp .env.example .env       # preencha as variáveis de ambiente
docker compose up -d       # sobe o PostgreSQL
npm install
npm run db:migrate         # cria as tabelas
npm run dev                # inicia em http://localhost:3333
~~~

### Endpoints principais
- POST /links — cria um link (valida formato e duplicidade do alias)
- GET /links — lista todos os links
- GET /links/:shortUrl — retorna a URL original
- PATCH /links/:shortUrl/access — incrementa acessos e retorna a URL original
- DELETE /links/:shortUrl — remove um link
- POST /links/exports — exporta o CSV para a CDN e retorna a URL pública

Variáveis de ambiente em server/.env.example (PORT, DATABASE_URL e credenciais do Cloudflare R2).

## Front-end (web/)

### Tecnologias
- React + TypeScript
- Vite (SPA, sem framework)
- React Router DOM
- TanStack React Query
- React Hook Form + Zod
- Tailwind CSS

### Como rodar
~~~bash
cd web
cp .env.example .env
npm install
npm run dev                # inicia em http://localhost:5173
~~~

### Páginas
- / — formulário de cadastro e listagem dos links
- /:short-url — redireciona para a URL original (incrementando o contador de acessos)
- qualquer outra rota — página 404 (recurso não encontrado)

## Layout

Baseado no arquivo do Figma disponibilizado no desafio (Encurtador de Links).

## Observação

⚠️ Este projeto foi gerado como material de estudo. O código não foi executado/testado localmente no momento da criação — recomenda-se clonar o repositório, instalar as dependências e validar antes de usar em produção.
# brev-ly
Encurtador de URL Full-Stack (Brev.ly) - Desafio Prático Rocketseat: Node.js + Fastify + Drizzle + Postgres (server) e React + Vite (web)
