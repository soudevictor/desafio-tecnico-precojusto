import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

// NOTE: Service para gerenciar posts da API JSONPlaceholder
// INFO: Agora com cache usando Signals (parecido com um estado global no React)

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private commentsUrl = 'https://jsonplaceholder.typicode.com/comments';

  // NOTE: Cache dos posts usando Signal
  // INFO: É como se fosse um useState global que todos os componentes podem acessar
  private postsCache = signal<Post[]>([]);
  private cacheCarregado = signal(false);

  // NOTE: Cache dos comentários por post
  // INFO: Uso um Map pra guardar comentários de cada post separado
  private commentsCache = signal<Map<number, Comment[]>>(new Map());

  constructor(private http: HttpClient) {}

  // NOTE: Busca todos os posts da API
  // INFO: Se já tem no cache, retorna do cache (não faz requisição de novo)
  getPosts(): Observable<Post[]> {
    // NOTE: Verifica se já carregou antes
    if (this.cacheCarregado()) {
      console.log('Retornando posts do cache');
      return of(this.postsCache());
    }

    // NOTE: Se não tem cache, busca da API
    console.log('Buscando posts da API...');
    return this.http.get<Post[]>(this.apiUrl).pipe(
      tap((posts) => {
        // NOTE: Salva no cache depois de receber
        this.postsCache.set(posts);
        this.cacheCarregado.set(true);
      })
    );
  }

  // NOTE: Busca um post específico pelo ID
  getPostById(id: number): Observable<Post> {
    // NOTE: Tenta achar no cache primeiro
    const postDoCache = this.postsCache().find((p) => p.id === id);
    if (postDoCache) {
      return of(postDoCache);
    }
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // NOTE: Cria um novo post
  // INFO: Adiciona no cache antes da resposta (optimistic update)
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    // NOTE: Cria um ID temporário pro post novo
    const idTemporario = Date.now();
    const novoPost: Post = { ...post, id: idTemporario } as Post;

    // NOTE: Adiciona no cache antes da API responder
    this.postsCache.update((posts) => [novoPost, ...posts]);

    return this.http.post<Post>(this.apiUrl, post).pipe(
      tap((postCriado) => {
        // NOTE: Troca o post temporário pelo real
        this.postsCache.update((posts) =>
          posts.map((p) => (p.id === idTemporario ? postCriado : p))
        );
      })
    );
  }

  // NOTE: Atualiza um post existente
  updatePost(id: number, post: Post): Observable<Post> {
    // NOTE: Guarda backup pra restaurar se der erro
    const backup = [...this.postsCache()];

    // NOTE: Atualiza no cache antes da API
    this.postsCache.update((posts) => posts.map((p) => (p.id === id ? { ...p, ...post } : p)));

    return this.http.put<Post>(`${this.apiUrl}/${id}`, post).pipe(
      tap({
        error: () => {
          // NOTE: Se der erro, volta pro backup
          this.postsCache.set(backup);
        },
      })
    );
  }

  // NOTE: Exclui um post pelo ID
  deletePost(id: number): Observable<void> {
    // NOTE: Guarda backup pra restaurar se der erro
    const backup = [...this.postsCache()];

    // NOTE: Remove do cache antes da API
    this.postsCache.update((posts) => posts.filter((p) => p.id !== id));

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        error: () => {
          // NOTE: Se der erro, volta pro backup
          this.postsCache.set(backup);
        },
      })
    );
  }

  // NOTE: Busca os comentários de um post específico
  getCommentsByPostId(postId: number): Observable<Comment[]> {
    // NOTE: Verifica se já tem no cache
    const comentariosDoCache = this.commentsCache().get(postId);
    if (comentariosDoCache) {
      return of(comentariosDoCache);
    }

    return this.http.get<Comment[]>(`${this.apiUrl}/${postId}/comments`).pipe(
      tap((comments) => {
        // NOTE: Salva no cache
        this.commentsCache.update((cache) => {
          const novoCache = new Map(cache);
          novoCache.set(postId, comments);
          return novoCache;
        });
      })
    );
  }

  // NOTE: Adiciona um comentário novo
  addComment(postId: number, comment: Omit<Comment, 'id'>): Observable<Comment> {
    const idTemporario = Date.now();
    const novoComment: Comment = { ...comment, id: idTemporario, postId } as Comment;

    // NOTE: Adiciona no cache antes
    this.commentsCache.update((cache) => {
      const novoCache = new Map(cache);
      const existentes = novoCache.get(postId) || [];
      novoCache.set(postId, [...existentes, novoComment]);
      return novoCache;
    });

    return this.http.post<Comment>(this.commentsUrl, { ...comment, postId }).pipe(
      tap((criado) => {
        // NOTE: Troca o temporário pelo real
        this.commentsCache.update((cache) => {
          const novoCache = new Map(cache);
          const comments = novoCache.get(postId) || [];
          novoCache.set(
            postId,
            comments.map((c) => (c.id === idTemporario ? criado : c))
          );
          return novoCache;
        });
      })
    );
  }

  // NOTE: Exclui um comentário
  deleteComment(postId: number, commentId: number): Observable<void> {
    const backup = new Map(this.commentsCache());

    // NOTE: Remove do cache antes
    this.commentsCache.update((cache) => {
      const novoCache = new Map(cache);
      const comments = novoCache.get(postId) || [];
      novoCache.set(
        postId,
        comments.filter((c) => c.id !== commentId)
      );
      return novoCache;
    });

    return this.http.delete<void>(`${this.commentsUrl}/${commentId}`).pipe(
      tap({
        error: () => {
          this.commentsCache.set(backup);
        },
      })
    );
  }
}
