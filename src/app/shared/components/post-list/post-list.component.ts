import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';

// Componente para listar posts
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  // INFO: Signal armazena os posts igual ao useState do React
  // NOTE: posts é reativo, quando atualizado, o template renderiza automaticamente
  posts = signal<Post[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  showDeleteModal = signal(false);
  postToDeleteId = signal<number | null>(null);

  // NOTE: Injetando o PostService
  constructor(private postService: PostService) {}

  // INFO: ngOnInit é como o useEffect(() => {}, []) do React, executa uma vez quando o componente é montado
  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // NOTE: Faz a requisição e atualiza o signal quando os dados chegarem
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data); // NOTE: atualiza o signal igual ao setState do React
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar posts:', err);
        this.errorMessage.set('Erro ao carregar os posts. Por favor, tente novamente mais tarde.');
        this.isLoading.set(false);
      },
    });
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

    const backup = [...this.posts()];

    const updatedPosts = this.posts().filter((post) => post.id !== id);
    this.posts.set(updatedPosts);

    this.closeDeleteModal();

    this.postService.deletePost(id).subscribe({
      next: () => {
        console.log('Post excluído com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao excluir post:', err);
        this.posts.set(backup);
        alert('Erro ao excluir o post. Tente novamente.');
      },
    });
  }
}
