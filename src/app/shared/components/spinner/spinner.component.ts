import { Component, Input } from '@angular/core';

// NOTE: Componente reutilizável de loading spinner
// INFO: No React seria um componente funcional simples com props
@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner-container flex flex-col items-center justify-center py-12">
      <!-- NOTE: Spinner animado com CSS puro -->
      <div class="spinner relative" [class]="tamanhoClasses" role="status" aria-label="Carregando">
        <div class="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"
        ></div>
      </div>

      <!-- NOTE: Mensagem opcional abaixo do spinner -->
      @if (mensagem) {
      <p class="text-slate-500 mt-4 text-sm">{{ mensagem }}</p>
      }
    </div>
  `,
})
export class SpinnerComponent {
  // INFO: @Input() é como props no React
  @Input() mensagem: string = '';
  @Input() tamanho: 'sm' | 'md' | 'lg' = 'md';

  // NOTE: Retorna classes de tamanho baseado no input
  get tamanhoClasses(): string {
    const tamanhos = {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
    };
    return tamanhos[this.tamanho];
  }
}
