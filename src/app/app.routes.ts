import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'carta-derechos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/carta-derechos/lista/lista.component').then(m => m.CartaDerechosListaComponent),
    data: { title: 'Carta de Derechos' }
  },
  {
    path: 'carta-derechos-crear',
    canActivate: [authGuard],
    loadComponent: () => import('./features/carta-derechos/crear-editar/crear-editar.component').then(m => m.CrearEditarCartaComponent),
    data: { title: 'Nueva Solicitud' }
  },
  {
    path: 'carta-derechos-editar/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/carta-derechos/crear-editar/crear-editar.component').then(m => m.CrearEditarCartaComponent),
    data: { title: 'Editar Solicitud' }
  },
  {
    path: 'carta-derechos-detalle/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/carta-derechos/detalle/detalle.component').then(m => m.DetalleCartaComponent),
    data: { title: 'Ver Solicitud' }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
