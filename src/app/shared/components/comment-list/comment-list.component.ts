import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Comment } from '../../../core/models/comment.model';

// Componente filho que recebe comentários via @Input()
@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent {
  // INFO: @Input() permite que o componente pai passe dados para o filho
  @Input() comments: Comment[] = [];
}
