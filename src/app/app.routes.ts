import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'log-in',
    pathMatch: 'full',
  },
  {
    path: 'log-in',
    loadComponent: () => import('./log-in/log-in.page').then( m => m.LogInPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'my-notes',
    loadComponent: () => import('./my-notes/my-notes.page').then( m => m.MyNotesPage)
  },
  {
    path: 'my-profile',
    loadComponent: () => import('./my-profile/my-profile.page').then( m => m.MyProfilePage)
  },
];
