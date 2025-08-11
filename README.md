# Dashboard Matheus

## 📖 Sobre o Projeto

O **Dashboard Matheus** é uma aplicação full-stack completa que serve como um painel de controlo administrativo robusto. Foi construído com um backend em **Node.js/Express** e um frontend moderno em **React**.

O sistema permite a gestão de conteúdo, o acompanhamento de leads, a visualização de estatísticas de acesso e a gestão de candidaturas, tudo protegido por um sistema de autenticação de administrador.

## ✨ Funcionalidades

* **Autenticação de Administrador**: Sistema seguro de registo, login e recuperação de senha para administradores.
* **Gestão de Publicações**: Funcionalidades completas de CRUD (Criar, Ler, Atualizar, Apagar) para publicações, com suporte a upload de imagens, agendamento e lixo.
* **Gestão de Leads**: Captura e listagem de leads provenientes de formulários, com funcionalidade para exportação em formato Excel.
* **Gestão de Candidaturas**: Sistema para receber e gerir candidaturas de vagas, incluindo visualização de currículos e envio de respostas por e-mail.
* **Painel de Resumo**: Uma visão geral com estatísticas rápidas sobre visitas, leads e publicações.
* **Visualização de Estatísticas**: Gráficos interativos que exibem dados de visitas e leads por dia, mês e ano.
* **Geolocalização**: Mapa interativo que mostra a origem dos acessos ao site por cidade/país.
* **Configurações de Perfil**: Administradores podem atualizar as suas informações pessoais, e-mail, senha e foto de perfil.
* **Chatbot (Backend)**: Uma base de conhecimento simples para responder a perguntas frequentes através de uma API.

## 🛠️ Tecnologias Utilizadas

#### **Backend**

* **Node.js**
* **Express.js**
* **MySQL2** para interação com a base de dados
* **JWT (JSON Web Token)** para autenticação
* **Bcrypt** para hashing de senhas
* **Nodemailer** para envio de e-mails
* **Multer** para upload de ficheiros
* **Helmet** para segurança de cabeçalhos HTTP
* **Express Rate Limit** para prevenir ataques de força bruta
* **ESLint** para linting de código
* **Nodemon** para desenvolvimento com auto-reload

#### **Frontend**

* **React**
* **React Router DOM** para gestão de rotas
* **Axios** para requisições HTTP
* **Framer Motion** para animações
* **React Icons** para iconografia
* **Chart.js** para renderização de gráficos
* **React Leaflet** para o mapa de geolocalização

## 🚀 Como Executar o Projeto

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* **NPM** (geralmente vem com o Node.js)
* Um servidor de base de dados **MySQL**

### 1. Configurando o Backend

1.  **Navegue até à pasta do backend**:
    ```bash
    cd backend
    ```

2.  **Crie o ficheiro de variáveis de ambiente**:
    Crie uma cópia do ficheiro `.env.example` (se houver) ou crie um novo ficheiro chamado `.env` na raiz da pasta `backend` e preencha com as suas configurações.
    ```env
    # Configurações do Servidor
    PORT=5000
    BASE_URL=http://localhost:5000
    CLIENT_URL=http://localhost:3000
    NODE_ENV=development
    
    # Base de Dados
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha
    DB_NAME=seu_database
    
    # E-mail (usado para recuperação de senha, etc.)
    EMAIL_SERVICE=Gmail
    EMAIL_USER=seu_email@gmail.com
    EMAIL_PASS=sua_senha_de_app_do_gmail
    CONTACT_EMAIL=email_para_receber_leads@dominio.com
    
    # JWT Secrets (use strings longas e aleatórias)
    JWT_SECRET=seu_segredo_super_secreto_para_jwt
    JWT_EXPIRES_IN=1d
    JWT_RESET_SECRET=seu_segredo_diferente_para_reset_de_senha
    
    # Configuração de Uploads
    UPLOAD_BASE_URL=/uploads
    ```

3.  **Instale as dependências**:
    ```bash
    npm install
    ```

4.  **Configure a Base de Dados**:
    Certifique-se de que o seu servidor MySQL está a correr e crie uma base de dados com o nome que definiu em `DB_NAME`. Precisará de criar as tabelas necessárias (ex: `credenciais`, `postagens`, `leads`, `candidaturas`, `access_logs`).

5.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
    O servidor backend estará a correr em `http://localhost:5000`.

### 2. Configurando o Frontend

1.  **Abra um novo terminal** e navegue até à pasta do frontend:
    ```bash
    cd frontend
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm start
    ```
    A aplicação React estará disponível em `http://localhost:3000`.

## 📂 Estrutura de Pastas (Simplificada)

```
/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middlewares/
│ │ ├── routes/
│ │ ├── utils/
│ │ └── server.js
│ └── package.json
│
└── frontend/
  ├── src/
  │ ├── admin/
  │ │ ├── secoes/
  │ │ └── ui/
  │ ├── hooks/
  │ ├── styles/
  │ ├── utils/
  │ ├── AdminDashboard.jsx
  │ └── index.js
  └── package.json
```

## 📜 Scripts Disponíveis

No diretório `backend`, pode executar:

* `npm run dev`: Inicia o servidor em modo de desenvolvimento.
* `npm run start`: Inicia o servidor em modo de produção.
* `npm run lint`: Executa o linter para verificar a qualidade do código.

## ✒️ Autor

* **Matheus Vaz**
