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

  // NOTE: Injetando o PostService
  constructor(private postService: PostService) {}

  // INFO: ngOnInit é como o useEffect(() => {}, []) do React, executa uma vez quando o componente é montado
  ngOnInit(): void {
    // NOTE: Faz a requisição e atualiza o signal quando os dados chegarem
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts.set(data); // NOTE: atualiza o signal igual ao setState do React
      },
      error: (err) => {
        console.error('Erro ao buscar posts:', err);
      },
    });
  }
}
