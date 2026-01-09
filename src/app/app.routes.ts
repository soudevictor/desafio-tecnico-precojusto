import { Routes } from '@angular/router';
import { PostDetailComponent } from './shared/components/post-detail/post-detail.component';
import { PostListComponent } from './shared/components/post-list/post-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
  },
];
