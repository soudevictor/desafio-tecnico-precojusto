import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';

// NOTE: Service para gerenciar posts da API JSONPlaceholder

// INFO: O HttpClient retorna Observables ao invés de Promises
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  // NOTE: Busca todos os posts da API
  // INFO: Retorna um Observable que pode ser subscribed no componente
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // NOTE: Busca um post específico pelo ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // NOTE: Busca os comentários de um post específico pelo ID do post
  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${postId}/comments`);
  }
}
