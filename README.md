# Desafio Técnico - Preço Justo

## 👋 Sobre o Projeto

Olá! Sou desenvolvedor júnior vindo do React e este é meu primeiro projeto em Angular. Criei uma aplicação para gerenciar posts usando a API do JSONPlaceholder, aplicando conceitos modernos do Angular 18+.

## 📦 Funcionalidades

- ✅ **Listagem de Posts** - Tabela com todos os posts da API
- ✅ **Detalhes do Post** - Visualização completa com comentários
- ✅ **Exclusão com Modal** - Confirmação antes de deletar
- ✅ **UI Otimista** - Feedback visual instantâneo
- ✅ **Loading State** - Spinner durante carregamento
- ✅ **Tratamento de Erros** - Mensagens claras em caso de falha
- ✅ **Navegação com Rotas** - Angular Router para SPA

## 🛠️ Estrutura do Projeto

```
src/app/
├── core/
│   ├── models/          # Interfaces (Post, Comment)
│   └── services/        # PostService (HttpClient)
├── shared/
│   └── components/      # Componentes reutilizáveis
│       ├── post-list/
│       ├── post-detail/
│       └── comment-list/
└── app.routes.ts        # Configuração de rotas
```

## 🎯 Como Rodar

### Instalação

```bash
# Clonar o repositório
git clone [###]

# Instalar dependências
npm install

# Rodar o projeto
npm start
```

O projeto estará disponível em `http://localhost:4200/`

## 🧠 O que aprendi

- Como usar **Signals** no Angular (muito parecido com useState do React!)
- Diferença entre **Observables** e **Promises**
- Como funciona o **ActivatedRoute**
- **@Input()** para passar props entre componentes (igual props no React)
- Nova sintaxe **@for** e **@if** (substituem *ngFor e *ngIf)
- Componentes **Standalone**

## 📚 Tecnologias Utilizadas

- **Angular 18**
- **TypeScript**
- **Tailwind CSS** + BEM
- **Signals**
- **HttpClient**
- **Angular Router**
- **JSONPlaceholder API**

## 🎨 Padrões de Código

- HTML Semântico
- Nomenclatura BEM
- Componentização clara e reutilizável
- Comentários explicativos no código
- Código organizado e limpo

---

**Desenvolvido por Devictor aprendendo Angular em 5 dias** 🚀
