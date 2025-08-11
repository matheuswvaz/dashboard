# Backend - Site Comercial NEPEN (Server Workspace)

Este é o backend para o Site Comercial do Grupo NEPEN, desenvolvido como um **workspace (`server/`)** dentro de um monorepo. Ele fornece uma API RESTful para gerenciar conteúdo, usuários administrativos, leads e outras funcionalidades da plataforma.

## ✨ Funcionalidades Principais

- **Gestão de Leads:**
  - Recebe dados de formulários de contato.
  - Salva as informações no banco de dados.
  - Envia notificações por e-mail para o administrador.
- **Gestão de Conteúdo (Postagens):**
  - Operações CRUD (Criar, Ler, Atualizar, Deletar) para artigos de blog e notícias.
  - Suporte para upload de imagens associadas às postagens.
  - Endpoint utilitário para upload de imagens avulsas (ex: para editores de texto rico).
- **Autenticação e Gerenciamento de Administradores:**
  - Cadastro seguro de novos administradores.
  - Login com JSON Web Tokens (JWT) para acesso a rotas protegidas.
  - Funcionalidade de recuperação de senha (envio de link por e-mail, formulário de reset).
  - Verificação de validade de token.
  - Gerenciamento de perfil do administrador (atualização de dados cadastrais, foto de perfil e senha).
- **Painel Administrativo (Endpoints de Suporte):**
  - Fornece dados do usuário administrador autenticado.
  - Disponibiliza estatísticas de visitas ao site.
  - Lista os leads capturados.
  - Fornece dados agregados para visualização em gráficos (ex: leads/visitas por período).
  - Visualização de dados de geolocalização agregados de acessos para exibição em mapa.
- **Log de Acessos:**
  - Registra acessos às páginas do frontend para contagem de visitantes e análise básica.
  - Registra detalhes de consentimento (analytics, marketing) fornecidos pelo usuário.
- **Configuração Centralizada:**
  - Utiliza variáveis de ambiente (via arquivo `.env`) para configurações sensíveis e específicas do ambiente.
- **Segurança:**
  - Hashing de senhas com `bcrypt`.
  - Proteção de rotas com JWT.
  - Validação e sanitização de entradas (utilizando `express-validator`).
  - Codificação de HTML (`he`) para saídas seguras (ex: em e-mails).
  - Cabeçalhos de segurança HTTP via `helmet`.
  - Limitação de taxa de requisições com `express-rate-limit`.
  - Configuração de CORS.

## 🛠️ Tecnologias Utilizadas

- **Core:** Node.js, Express.js
- **Banco de Dados:** MySQL (com o driver `mysql2`)
- **Autenticação:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`
- **E-mail:** Nodemailer
- **Uploads:** Multer
- **Validação:** `express-validator`
- **Sanitização/Encoding:** `he`
- **Configuração:** `dotenv`
- **Segurança:** `helmet`, `express-rate-limit`, `cors`
- **Geolocalização de IP:** `geoip-lite`
- _(Consulte `server/package.json` para a lista completa de dependências)_

## 📐 Arquitetura e Estrutura do Projeto (`server/`)

Este diretório (`server/`) é um workspace dentro da estrutura do monorepo `Site-Comercial-NEPEN/`.

```
server/
├── node_modules/       # Dependências específicas deste workspace
├── src/
│   ├── config/         # Configurações (banco de dados, e-mail, uploads, variáveis de ambiente)
│   ├── controllers/    # Lógica de controle de requisições, interação com serviços/modelos
│   ├── middlewares/    # Middlewares customizados (autenticação, logs de erro, etc.)
│   ├── models/         # (Opcional, se usar ORM ou schemas de validação mais complexos aqui)
│   ├── routes/         # Definição dos endpoints da API e roteamento
│   ├── utils/          # Funções utilitárias (ex: responseHandler, formatação de data)
│   └── server.js       # Ponto de entrada principal, configuração e inicialização do servidor Express
├── uploads/            # Diretório para armazenamento de imagens
├── .env.example        # Arquivo de exemplo para variáveis de ambiente para o servidor
├── .env                # Arquivo de variáveis de ambiente
├── .gitignore          # Especifica arquivos e pastas a serem ignorados pelo Git neste workspace
├── package.json        # Metadados do projeto, dependências e scripts específicos deste workspace backend
└── README.md           # Este arquivo

```

## ✅ Pré-requisitos

* [Node.js](https://nodejs.org/) (versão LTS, ex: v18.x ou v20.x, é recomendada - conforme `engines` no `package.json`)
* [npm](https://www.npmjs.com/) (v8.x ou superior, que suporta workspaces) ou [Yarn](https://yarnpkg.com/)
* Servidor MySQL em execução e acessível.
* Git para controle de versão.

## 🚀 Instalação e Configuração

**Nota:** A instalação de dependências é idealmente gerenciada a partir da raiz do monorepo (`Site-Comercial-NEPEN/`).

1.  **Se ainda não o fez, clone o repositório principal e instale todas as dependências dos workspaces:**
    A partir da pasta raiz do monorepo (`Site-Comercial-NEPEN/`):
    ```bash
    # Se ainda não clonou:
    # git clone [[https://gitlab.nepen.org.br/nepen/site-comercial](https://gitlab.nepen.org.br/nepen/site-comercial)]
    # cd Site-Comercial-NEPEN

    npm install
    ```

2.  **Configure as Variáveis de Ambiente para o Servidor:**
    * Dentro da pasta `server/`, copie `server/.env.example` para `server/.env`:
        ```bash
        cp .env.example .env
        ```
    * Edite o arquivo `server/.env` recém-criado e preencha **todos** os valores apropriados:
        ```dotenv
        # Configurações do Servidor
        PORT=5000
        BASE_URL=http://localhost:5000
        NODE_ENV=development # ou production
        CLIENT_URL=http://localhost:3000 

        # Configurações do Banco de Dados MySQL
        DB_HOST=localhost
        DB_USER=seu_usuario_mysql
        DB_PASSWORD=sua_senha_mysql
        DB_NAME=seu_banco_de_dados # Ex: nepen_site

        # Configurações de E-mail (usando Nodemailer)
        EMAIL_SERVICE=gmail # ou outro provedor SMTP suportado
        EMAIL_USER=seu_email_de_envio@gmail.com
        EMAIL_PASS=sua_senha_de_app_do_email # Para Gmail, use uma App Password
        CONTACT_EMAIL=email_de_destino_para_notificacoes@exemplo.com

        # Configurações de JWT (JSON Web Tokens)
        JWT_SECRET=gere_um_segredo_forte_e_aleatorio_aqui
        JWT_EXPIRES_IN=1h # ou 7d, 30d, etc.
        JWT_RESET_SECRET=gere_outro_segredo_forte_e_aleatorio_para_reset

        # Configurações de Upload
        UPLOAD_BASE_URL=/uploads # Caminho base para servir os arquivos de upload

        # Configurações de Log
        LOG_ALL_REQUESTS_TO_DB=true # ou false. Controla se todos os logs de acesso são salvos no banco.
        ```
        **Importante:** Use segredos fortes e únicos para `JWT_SECRET` e `JWT_RESET_SECRET`.

## 🗄️ Banco de Dados

Antes de iniciar o servidor, certifique-se de que o banco de dados especificado em `DB_NAME` exista.
A estrutura detalhada das tabelas deve ser definida e mantida no script `schema.sql` localizado em `server/db_setup/` (ou caminho similar, conforme organização do projeto). É crucial que este script esteja atualizado com todas as colunas necessárias, incluindo campos para consentimento detalhado como:

* `consent_marketing` (Booleano) na tabela `leads`.
* `consent_details` (JSON ou TEXT) na tabela `access_logs` para armazenar os consentimentos de analytics e marketing.

As tabelas principais incluem:

* `credenciais`
* `postagens`
* `leads`
* `access_logs`

(Consulte o `schema.sql` para a definição completa e atualizada.)

## ▶️ Executando a Aplicação (Servidor)

Os scripts a seguir são definidos em `server/package.json`. Eles podem ser executados diretamente de dentro da pasta `server/` ou através de scripts definidos no `package.json` da raiz do monorepo (usando a flag `--workspace=server`).

* **Modo de Desenvolvimento (com Nodemon para recarregamento automático):**
    * A partir da raiz do monorepo (`Site-Comercial-NEPEN/`):
        ```bash
        npm run dev:server 
        ```
    * Ou, diretamente de `server/`:
        ```bash
        npm run dev
        ```

* **Modo de Produção (Recomendado usar um gerenciador de processos como PM2):**
    * A partir da raiz do monorepo (`Site-Comercial-NEPEN/`):
        ```bash
        npm run start:server 
        ```
    * Ou, diretamente de `server/`:
        ```bash
        npm start
        ```

A API estará disponível na URL e porta configuradas em `BASE_URL` e `PORT` (ex: `http://localhost:5000`).

## 📡 Endpoints Principais da API

*Nota: Rotas marcadas com `(Admin)` requerem autenticação JWT no cabeçalho `Authorization: Bearer <token>`.*

* **Leads:**
    * `POST /enviar-email`: Submete um novo lead a partir do formulário de contato.
* **Autenticação:**
    * `POST /admin-register`: Registra um novo administrador.
    * `POST /admin-login`: Realiza o login do administrador.
    * `POST /admin-forgot-password`: Inicia o processo de recuperação de senha.
    * `GET /reset-password/:token`: Exibe o formulário para redefinir a senha.
    * `POST /admin-reset-password`: Processa a redefinição de senha.
    * `GET /verify-token (Admin)`: Verifica a validade do token JWT do administrador.
* **Postagens (Blog/Notícias):**
    * `GET /api/postagens`: Lista todas as postagens (suporta filtro por `categoria` via query param).
    * `POST /api/postagens (Admin)`: Cria uma nova postagem.
    * `GET /api/postagens/:id`: Obtém uma postagem específica pelo ID.
    * `PUT /api/postagens/:id (Admin)`: Atualiza uma postagem existente.
    * `DELETE /api/postagens/:id (Admin)`: Deleta uma postagem.
    * `POST /api/upload/image (Admin)`: Endpoint utilitário para upload de imagens.
* **Administração (Painel do Admin):**
    * `GET /api/admin/user-data (Admin)`: Obtém dados do administrador autenticado.
    * `GET /api/admin/visitor-stats (Admin)`: Obtém estatísticas de visitantes.
    * `GET /api/admin/leads (Admin)`: Lista os leads capturados (suporta `limit` via query param).
    * `GET /api/admin/map-data (Admin)`: Obtém dados de geolocalização para o mapa.
    * `POST /api/admin/profile/photo (Admin)`: Atualiza a foto de perfil do administrador.
    * `DELETE /api/admin/profile/photo (Admin)`: Remove a foto de perfil do administrador.
    * `PUT /api/admin/profile (Admin)`: Atualiza os dados cadastrais do administrador.
    * `PUT /api/admin/profile/password (Admin)`: Atualiza a senha do administrador.
* **Dados para Gráficos (Dashboard):**
    * `GET /api/chart-data (Admin)`: Fornece dados formatados para gráficos de leads e visitas.
* **Logs de Acesso:**
    * `POST /api/log-view`: Registra uma visualização de página do frontend.
* **Saúde do Sistema:**
    * `GET /health`: Verifica o status da aplicação.

## 🛡️ Considerações de Segurança Adicionais

* **Variáveis de Ambiente:** Nunca comite arquivos `.env` contendo segredos no repositório. Use `.env.example` como template.
* **HTTPS em Produção:** Sempre use HTTPS em ambiente de produção para proteger os dados em trânsito.
* **Validação de Entrada:** Continue a validar e sanitizar todas as entradas do usuário no backend, mesmo que o frontend também o faça.
* **Gerenciamento de Erros:** Implemente um tratamento de erros robusto que não exponha informações sensíveis.
* **Atualizações de Dependências:** Mantenha as dependências do projeto atualizadas para corrigir vulnerabilidades conhecidas.

## 📄 Licença

[PENDENTE] 
---