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
}
