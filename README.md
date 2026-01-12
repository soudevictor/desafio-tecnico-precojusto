# Desafio Técnico - Preço Justo

## 👋 Sobre o Projeto

Este projeto foi desenvolvido como parte do **Desafio Técnico da Preço Justo** para a vaga de desenvolvedor frontend.

Sou desenvolvedor júnior vindo do React e este é meu primeiro projeto em Angular. A proposta era criar uma aplicação para gerenciar posts e comentários consumindo a API pública do JSONPlaceholder, aplicando conceitos modernos do Angular 18+.

A aplicação tem um visual de **rede social** inspirado no Facebook/LinkedIn, com cards de posts, sistema de comentários estilo chat, e interface responsiva.

## 🚀 Demo

Para rodar o projeto localmente:

```bash
# Clonar o repositório
git clone https://github.com/soudevictor/desafio-tecnico-precojusto.git

# Entrar na pasta
cd desafio-tecnico-precojusto

# Instalar dependências
npm install

# Rodar o projeto
npm start
```

Acesse `http://localhost:4200/` no navegador.

## ✅ Funcionalidades Implementadas

### CRUD de Posts

- ✅ **Listagem** - Feed de posts estilo rede social
- ✅ **Criar** - Formulário para novo post
- ✅ **Editar** - Modal/página de edição
- ✅ **Excluir** - Modal de confirmação antes de deletar

### CRUD de Comentários

- ✅ **Listar** - Comentários do post na página de detalhes
- ✅ **Adicionar** - Formulário inline para novo comentário
- ✅ **Excluir** - Botão de excluir em cada comentário

### Recursos Avançados

- ✅ **Paginação** - Navegação entre páginas de posts
- ✅ **Busca** - Filtro por título ou conteúdo
- ✅ **Ordenação** - Por ID, título, conteúdo ou usuário
- ✅ **Cache in-memory** - Posts e comentários em memória com Signals
- ✅ **Atualização Otimista** - UI atualiza antes da resposta da API, com rollback em caso de erro

### UI/UX

- ✅ **Loading States** - Spinner reutilizável durante carregamento
- ✅ **Tratamento de Erros** - Mensagens amigáveis
- ✅ **Responsivo** - Mobile first com Tailwind CSS
- ✅ **Acessibilidade** - aria-labels, foco no teclado, navegação acessível

## 🛠️ Estrutura do Projeto

```
src/app/
├── core/
│   ├── interceptors/    # HTTP Interceptor (headers, erros)
│   ├── models/          # Interfaces (Post, Comment)
│   └── services/        # PostService com cache
├── shared/
│   └── components/      # Componentes reutilizáveis
│       ├── post-list/       # Feed de posts + paginação
│       ├── post-detail/     # Detalhes + comentários
│       ├── post-form/       # Criar/Editar post
│       ├── comment-list/    # Lista de comentários
│       └── spinner/         # Loading spinner
└── app.routes.ts        # Configuração de rotas
```

### Rotas

| Rota             | Componente          | Descrição              |
| ---------------- | ------------------- | ---------------------- |
| `/`              | PostListComponent   | Lista de posts (feed)  |
| `/post/novo`     | PostFormComponent   | Criar novo post        |
| `/post/:id`      | PostDetailComponent | Detalhes + comentários |
| `/post/:id/edit` | PostFormComponent   | Editar post existente  |

## 📚 Tecnologias Utilizadas

- **Angular 18** - Framework principal
- **TypeScript** - Tipagem forte
- **Tailwind CSS** - Estilização utility-first
- **Signals** - Gerenciamento de estado reativo
- **HttpClient** - Requisições HTTP
- **Interceptors** - Headers e tratamento de erros
- **Font Awesome 6** - Ícones
- **Google Fonts (Inter)** - Tipografia

## 🎨 Padrões de Código

- Componentes **Standalone** (padrão Angular 18)
- Nova sintaxe **@for** e **@if**
- **async pipe** substituído por Signals
- Comentários com `// NOTE:` explicando o que o código faz
- Comentários com `// INFO:` comparando com React (pra eu lembrar)

### 💡 Extensão Recomendada

Para melhor visualização dos comentários no código, recomendo instalar a extensão **Better Comments** no VS Code:

- **Link:** [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)

Com ela, os comentários ficam coloridos:

- `// NOTE:` → Destaque em azul (explicação do código)
- `// INFO:` → Destaque em verde (comparação com React)

## ✨ O que aprendi

1. **Signals** são muito parecidos com `useState()` do React
2. **@Input()** e **@Output()** são como props e callbacks no React
3. **ActivatedRoute** é tipo o `useParams()` do React Router
4. **Interceptors** são middlewares pra requisições HTTP
5. **computed()** é igual ao `useMemo()` - recalcula quando dependências mudam
6. Nova sintaxe `@for` e `@if` é bem mais limpa que as diretivas antigas

---

**Desenvolvido por João Victor Carvalho aprendendo Angular** 🚀

**Tempo de desenvolvimento:** ~5 dias
