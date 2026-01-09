import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
