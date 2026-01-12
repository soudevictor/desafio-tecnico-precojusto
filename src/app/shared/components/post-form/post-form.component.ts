import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';

// NOTE: Componente que serve pra criar E editar posts
// INFO: No React eu faria um componente só com lógica diferente baseada em props
@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent implements OnInit {
  // NOTE: Signals pro formulário
  titulo = signal('');
  corpo = signal('');
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  // NOTE: Se tem postId, é edição. Se não tem, é criação.
  postId = signal<number | null>(null);

  // INFO: Computed pra saber se é modo edição ou criação
  // NOTE: Uso uma função simples ao invés de computed pq é mais fácil de entender
  get isEdicao(): boolean {
    return this.postId() !== null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    // NOTE: Pega o ID da URL se existir
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // NOTE: Modo edição - carrega o post existente
      this.postId.set(Number(id));
      this.carregarPost(Number(id));
    }
    // NOTE: Se não tem ID, é modo criação - formulário começa vazio
  }

  // NOTE: Carrega os dados do post pra edição
  carregarPost(id: number): void {
    this.isLoading.set(true);

    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.titulo.set(post.title);
        this.corpo.set(post.body);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar post:', err);
        this.errorMessage.set('Erro ao carregar o post.');
        this.isLoading.set(false);
      },
    });
  }

  // NOTE: Salva o post (cria ou atualiza)
  salvar(): void {
    // NOTE: Validação simples
    if (!this.titulo().trim() || !this.corpo().trim()) {
      this.errorMessage.set('Preencha todos os campos.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    if (this.isEdicao) {
      // NOTE: Modo edição - atualiza o post existente
      const postAtualizado: Post = {
        id: this.postId()!,
        title: this.titulo(),
        body: this.corpo(),
        userId: 1, // NOTE: Mantém o userId fixo por simplicidade
      };

      this.postService.updatePost(this.postId()!, postAtualizado).subscribe({
        next: () => {
          console.log('Post atualizado com sucesso!');
          // NOTE: Volta pra página de detalhes
          this.router.navigate(['/post', this.postId()]);
        },
        error: (err) => {
          console.error('Erro ao atualizar post:', err);
          this.errorMessage.set('Erro ao atualizar o post. Tente novamente.');
          this.isSaving.set(false);
        },
      });
    } else {
      // NOTE: Modo criação - cria um post novo
      const novoPost = {
        title: this.titulo(),
        body: this.corpo(),
        userId: 1, // NOTE: UserId fixo por simplicidade
      };

      this.postService.createPost(novoPost).subscribe({
        next: (postCriado) => {
          console.log('Post criado com sucesso!', postCriado);
          // NOTE: Volta pra lista de posts
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Erro ao criar post:', err);
          this.errorMessage.set('Erro ao criar o post. Tente novamente.');
          this.isSaving.set(false);
        },
      });
    }
  }

  // NOTE: Cancela e volta pra página anterior
  cancelar(): void {
    if (this.isEdicao) {
      this.router.navigate(['/post', this.postId()]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
