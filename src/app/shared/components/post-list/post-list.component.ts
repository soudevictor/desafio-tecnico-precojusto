import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';

// NOTE: Tipo pra saber qual coluna estou ordenando
type ColunaOrdenacao = 'id' | 'title' | 'body' | 'userId';
type DirecaoOrdenacao = 'asc' | 'desc';

// Componente para listar posts
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  // INFO: Signal armazena os posts igual ao useState do React
  // NOTE: posts é reativo, quando atualizado, o template renderiza automaticamente
  posts = signal<Post[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // NOTE: Signals pro modal de exclusão
  showDeleteModal = signal(false);
  postToDeleteId = signal<number | null>(null);

  // NOTE: Signal pra busca (o que o usuário digita)
  // INFO: É como um useState pra guardar o texto do input
  textoBusca = signal('');

  // NOTE: Signals pra ordenação
  colunaOrdenacao = signal<ColunaOrdenacao>('id');
  direcaoOrdenacao = signal<DirecaoOrdenacao>('asc');

  // NOTE: Signals pra paginação
  paginaAtual = signal(1);
  itensPorPagina = signal(10);

  // INFO: computed() é como useMemo do React - recalcula quando as dependências mudam

  // NOTE: Primeiro filtra os posts pela busca
  postsFiltrados = computed(() => {
    const busca = this.textoBusca().toLowerCase().trim();
    const todosPosts = this.posts();

    if (!busca) {
      return todosPosts;
    }

    // NOTE: Filtra por título ou corpo
    return todosPosts.filter(
      (post) => post.title.toLowerCase().includes(busca) || post.body.toLowerCase().includes(busca)
    );
  });

  // NOTE: Depois ordena os posts filtrados
  postsOrdenados = computed(() => {
    const posts = [...this.postsFiltrados()];
    const coluna = this.colunaOrdenacao();
    const direcao = this.direcaoOrdenacao();

    return posts.sort((a, b) => {
      let comparacao = 0;

      // NOTE: Se for número, compara direto
      if (coluna === 'id' || coluna === 'userId') {
        comparacao = a[coluna] - b[coluna];
      } else {
        // NOTE: Se for texto, usa localeCompare
        comparacao = a[coluna].localeCompare(b[coluna]);
      }

      // NOTE: Se for desc, inverte
      return direcao === 'asc' ? comparacao : -comparacao;
    });
  });

  // NOTE: Por último, pagina os posts ordenados
  postsPaginados = computed(() => {
    const posts = this.postsOrdenados();
    const pagina = this.paginaAtual();
    const porPagina = this.itensPorPagina();

    const inicio = (pagina - 1) * porPagina;
    const fim = inicio + porPagina;

    return posts.slice(inicio, fim);
  });

  // NOTE: Calcula total de páginas
  totalPaginas = computed(() => {
    const total = this.postsFiltrados().length;
    const porPagina = this.itensPorPagina();
    return Math.ceil(total / porPagina) || 1;
  });

  // NOTE: Array com os números das páginas pra mostrar os botões
  numerosPaginas = computed(() => {
    const total = this.totalPaginas();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // NOTE: Injetando o PostService
  constructor(private postService: PostService) {}

  // INFO: ngOnInit é como o useEffect(() => {}, []) do React
  ngOnInit(): void {
    this.carregarPosts();
  }

  // NOTE: Método pra carregar os posts
  carregarPosts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar posts:', err);
        this.errorMessage.set('Erro ao carregar os posts. Por favor, tente novamente mais tarde.');
        this.isLoading.set(false);
      },
    });
  }

  // NOTE: Quando o usuário digita na busca
  onBusca(texto: string): void {
    this.textoBusca.set(texto);
    this.paginaAtual.set(1); // NOTE: Volta pra página 1 quando busca
  }

  // NOTE: Quando clica no header da tabela pra ordenar
  onOrdenar(coluna: ColunaOrdenacao): void {
    if (this.colunaOrdenacao() === coluna) {
      // NOTE: Se clicou na mesma coluna, inverte a direção
      this.direcaoOrdenacao.set(this.direcaoOrdenacao() === 'asc' ? 'desc' : 'asc');
    } else {
      // NOTE: Se clicou em outra coluna, começa com asc
      this.colunaOrdenacao.set(coluna);
      this.direcaoOrdenacao.set('asc');
    }
  }

  // NOTE: Retorna o ícone de ordenação pra mostrar no header
  getIconeOrdenacao(coluna: ColunaOrdenacao): string {
    if (this.colunaOrdenacao() !== coluna) {
      return '↕️';
    }
    return this.direcaoOrdenacao() === 'asc' ? '⬆️' : '⬇️';
  }

  // NOTE: Navegação de páginas
  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaAtual.set(pagina);
    }
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual() - 1);
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtual() + 1);
  }

  // NOTE: Quando muda a quantidade de itens por página
  onItensPorPaginaChange(valor: number): void {
    this.itensPorPagina.set(valor);
    this.paginaAtual.set(1);
  }

  // NOTE: Abre o modal de confirmação de exclusão
  openDeleteModal(id: number): void {
    this.postToDeleteId.set(id);
    this.showDeleteModal.set(true);
  }

  // NOTE: Fecha o modal sem excluir
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.postToDeleteId.set(null);
  }

  // NOTE: Lógica de exclusão do post
  confirmDelete(): void {
    const id = this.postToDeleteId();

    if (!id) return;

    // NOTE: Atualiza localmente (o service também atualiza o cache dele)
    this.posts.update((posts) => posts.filter((post) => post.id !== id));
    this.closeDeleteModal();

    this.postService.deletePost(id).subscribe({
      next: () => {
        console.log('Post excluído com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir post:', err);
        // NOTE: Se der erro, recarrega os posts
        this.carregarPosts();
        alert('Erro ao excluir o post. Tente novamente.');
      },
    });
  }
}
