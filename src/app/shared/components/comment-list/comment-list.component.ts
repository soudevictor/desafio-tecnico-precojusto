import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../core/models/comment.model';

// Componente filho que recebe comentários via @Input()
// NOTE: Agora também emite eventos pro pai quando adiciona ou exclui
@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent {
  // INFO: @Input() permite que o componente pai passe dados para o filho
  @Input() comments: Comment[] = [];
  @Input() postId: number = 0;

  // INFO: @Output() permite que o filho envie eventos pro pai
  // NOTE: É como passar uma função callback via props no React
  @Output() comentarioAdicionado = new EventEmitter<Omit<Comment, 'id' | 'postId'>>();
  @Output() comentarioExcluido = new EventEmitter<number>();

  // NOTE: Signals pro formulário de novo comentário
  novoNome = signal('');
  novoEmail = signal('');
  novoCorpo = signal('');
  mostrarFormulario = signal(false);

  // NOTE: Abre/fecha o formulário de adicionar
  toggleFormulario(): void {
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  // NOTE: Adiciona um novo comentário
  adicionarComentario(): void {
    // NOTE: Validação simples
    if (!this.novoNome().trim() || !this.novoEmail().trim() || !this.novoCorpo().trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    // NOTE: Emite o evento pro componente pai
    // INFO: É como chamar props.onAdd() no React
    this.comentarioAdicionado.emit({
      name: this.novoNome(),
      email: this.novoEmail(),
      body: this.novoCorpo(),
    });

    // NOTE: Limpa o formulário
    this.novoNome.set('');
    this.novoEmail.set('');
    this.novoCorpo.set('');
    this.mostrarFormulario.set(false);
  }

  // NOTE: Exclui um comentário
  excluirComentario(commentId: number): void {
    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      // NOTE: Emite o evento pro componente pai
      this.comentarioExcluido.emit(commentId);
    }
  }
}
