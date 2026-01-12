import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

// NOTE: Componente raiz da aplicação
// INFO: É como o App.tsx no React que envolve toda a aplicação
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Desafio Técnico - Preço Justo');
}
