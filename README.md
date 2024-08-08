## 🚀 Descrição

O Sistema de Compras é uma aplicação ReactJS que permite aos gestores:

- Gerenciar informações sobre fornecedores
- Gerenciar contatos de fornecedores
- Gerenciar produtos e suas categorias
- Visualizar e gerenciar cotações de produtos

A aplicação requer um login para ser acessada, que é realizado via Firebase.

## 📋 Funcionalidades

- Login via Firebase
- Ciclo de gestão de fornecedores
- Gestão de contatos de fornecedores
- Gestão de produtos e suas categorias
- Visualização e gestão de cotações

## 🛠️ Tecnologias Utilizadas

- ReactJS
- Firebase (para autenticação)

## 📦 Como Rodar o Projeto

Siga os passos abaixo para rodar a aplicação localmente:

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/vctorgriggi/sistema-compras
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd sistema-compras
   ```

3. **Preencha os dados do Firebase:**

   Renomeie o arquivo `.env.example` para `.env` e preencha os dados do Firebase.

4. **Verifique a API:**

   Certifique-se de que a API `sistema-compras-api` esteja rodando. Por padrão, se a API estiver rodando localmente, ela estará disponível em `http://localhost:3333`.

   - Caso a API esteja na porta padrão (`http://localhost:3333`), a aplicação front-end buscará automaticamente essa URL, sem a necessidade de definir `API_URL` no arquivo `.env`.
   - Se a API estiver em uma porta diferente ou hospedada remotamente, atualize a URL da API no arquivo `.env` conforme necessário, utilizando a variável `API_URL`.

5. **Instale as dependências:**

   ```bash
   npm install
   ```

6. **Inicie a aplicação:**

   ```bash
   npm run dev
   ```

7. **Abra o navegador e acesse `http://localhost:5173`.**
