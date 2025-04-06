# 🎨 Frontend Lumi

Frontend do desafio técnico da Lumi, desenvolvido com React, TypeScript e Vite. A aplicação consome a API do backend e possui estrutura modular com componentes reutilizáveis, hooks, serviços e mais.

---

## 🖼️ Imagens do projeto

![Screenshot 2025-04-06 at 20 21 57](https://github.com/user-attachments/assets/ab7c4cd8-d60f-4c9f-bb87-b2a9538358ee)
![Screenshot 2025-04-06 at 20 22 21](https://github.com/user-attachments/assets/9459778c-aaad-44af-b785-7c072bcf1f27)


---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, você precisará ter instalado:

- [Node.js](https://nodejs.org/) (versão recomendada: 18+)
- [Yarn](https://classic.yarnpkg.com/lang/en/) ou `npm`

---

## 🚀 Rodando o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/lucasmoraessouza/lumi-frontend.git
cd lumi-frontend
```

### 2. Instale as dependências

Com npm:

```bash
npm install
```

ou com yarn:

```bash
yarn install
```

### 3. Configure o ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis necessárias, como:

```bash
VITE_API_URL=http://localhost:3333
```

### 4. Rode o projeto em modo desenvolvimento

```bash
npm run dev
```

ou com yarn:

```bash
yarn dev
```

### 5. ✅ Pronto!

A aplicação estará rodando em:  
[http://localhost:5173](http://localhost:5173)

---

## 🗂 Estrutura de Pastas

```text
src/
├── app/         # Setup global da aplicação
├── assets/      # Arquivos estáticos (imagens, fontes etc.)
├── components/  # Componentes reutilizáveis
├── dtos/        # Tipagens e contratos de dados
├── hooks/       # Custom hooks
├── lib/         # Bibliotecas auxiliares
├── mock/        # Dados mockados
├── pages/       # Páginas da aplicação
├── services/    # Serviços de requisições
├── utils/       # Funções utilitárias
├── App.tsx      # Componente raiz
├── main.tsx     # Entry point da aplicação
```

---

## 🙏 Agradecimentos

```text
Agradeço pela oportunidade oferecida pela Lupi.
```
