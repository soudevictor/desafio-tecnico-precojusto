import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// NOTE: Interceptor funciona igual ao axios.interceptors do React
// INFO: Ele intercepta TODAS as requisições antes de sair e depois de voltar

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // NOTE: Clona a requisição e adiciona headers padrão
  const apiReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
    },
  });

  // NOTE: Passa a requisição adiante e trata erros
  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // NOTE: Log do erro no console pra ajudar no debug
      console.error('Erro na requisição:', error.status, error.message);

      // NOTE: Retorna o erro pro componente tratar
      return throwError(() => error);
    })
  );
};
