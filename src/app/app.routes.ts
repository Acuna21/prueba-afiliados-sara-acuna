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
    loadComponent: () => import('./features/carta-derechos/carta-derechos.component').then(m => m.CartaDerechosComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/carta-derechos/lista/lista.component').then(m => m.CartaDerechosListaComponent),
        data: { title: 'Carta de Derechos' }
      },
      {
        path: 'detalle/:id',
        loadComponent: () => import('./features/carta-derechos/detalle/detalle.component').then(m => m.DetalleCartaComponent),
        data: { title: 'Ver Solicitud' }
      }
    ]
  },
  {
    path: 'certificado',
    canActivate: [authGuard],
    loadComponent: () => import('./features/certificado/certificado.component').then(m => m.CertificadoComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
