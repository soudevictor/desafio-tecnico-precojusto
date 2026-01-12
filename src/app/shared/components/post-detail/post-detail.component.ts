import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Comment } from '../../../core/models/comment.model';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';
import { CommentListComponent } from '../comment-list/comment-list.component';

// Componente de detalhes de um post específico
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentListComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit {
  // NOTE: Signals para armazenar o post e comentários
  post = signal<Post | null>(null);
  comments = signal<Comment[]>([]);
  isLoading = signal(true);

  // INFO: ActivatedRoute é como o useParams() do React, permite pegar parâmetros da URL
  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    // INFO: Pega o ID da URL (parâmetro dinâmico da rota)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      // NOTE: Busca o post pelo ID
      this.postService.getPostById(id).subscribe({
        next: (data) => {
          this.post.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Erro ao buscar post:', err);
          this.isLoading.set(false);
        },
      });

      // NOTE: Busca os comentários do post
      this.postService.getCommentsByPostId(id).subscribe({
        next: (data) => {
          this.comments.set(data);
        },
        error: (err) => {
          console.error('Erro ao buscar comentários:', err);
        },
      });
    }
  }

  // NOTE: Handler quando um comentário é adicionado pelo CommentListComponent
  // INFO: Como em React quando um componente filho emite um evento pro pai
  onComentarioAdicionado(dadosComentario: Omit<Comment, 'id' | 'postId'>): void {
    const postId = this.post()?.id;
    if (!postId) return;

    // NOTE: Monta o comentário completo adicionando o postId
    const novoComentario: Omit<Comment, 'id'> = {
      ...dadosComentario,
      postId: postId,
    };

    // NOTE: Chama o service pra adicionar o comentário (postId, comment)
    this.postService.addComment(postId, novoComentario).subscribe({
      next: (comentarioCriado) => {
        // NOTE: Atualiza a lista local adicionando o novo comentário
        this.comments.update((lista) => [...lista, comentarioCriado]);
      },
      error: (err) => {
        console.error('Erro ao adicionar comentário:', err);
        alert('Erro ao adicionar comentário. Tente novamente.');
      },
    });
  }

  // NOTE: Handler quando um comentário é excluído pelo CommentListComponent
  onComentarioExcluido(commentId: number): void {
    const postId = this.post()?.id;
    if (!postId) return;

    // NOTE: Guarda lista anterior pra rollback em caso de erro
    const listaAnterior = this.comments();

    // NOTE: Atualização otimista - remove da UI antes da API responder
    this.comments.update((lista) => lista.filter((c) => c.id !== commentId));

    // NOTE: Chama o service pra excluir o comentário (postId, commentId)
    this.postService.deleteComment(postId, commentId).subscribe({
      next: () => {
        console.log('Comentário excluído com sucesso');
      },
      error: (err) => {
        console.error('Erro ao excluir comentário:', err);
        // NOTE: Rollback em caso de erro
        this.comments.set(listaAnterior);
        alert('Erro ao excluir comentário. Tente novamente.');
      },
    });
  }
}
