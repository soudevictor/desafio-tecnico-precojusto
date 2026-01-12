import { Routes } from '@angular/router';
import { PostDetailComponent } from './shared/components/post-detail/post-detail.component';
import { PostFormComponent } from './shared/components/post-form/post-form.component';
import { PostListComponent } from './shared/components/post-list/post-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'post/novo',
    component: PostFormComponent,
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
  },
  {
    path: 'post/:id/edit',
    component: PostFormComponent,
  },
];
