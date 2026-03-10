import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
  <nav class="sticky top-0 z-50 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white shadow-sm">
  
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
      <div class="flex h-20 items-center justify-between">
  
        <div class="flex items-center gap-3">
  
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow cursor-pointer hover:bg-blue-700 transition"
            (click)="goToDashboard()">
            🏥
          </div>
  
          <div class="flex flex-col cursor-pointer hover:text-blue-700 transition"
            (click)="goToDashboard()">
            <h1 class="text-xl font-bold text-blue-600">
              Portal Afiliados
            </h1>
            <span class="text-xs text-gray-500">
              Sistema de Gestión
            </span>
          </div>
  
        </div>
  
        <!-- RIGHT SIDE -->
        <div class="flex items-center gap-3">
  
          <!-- USER MENU -->
          <div class="relative">
  
            <button
              (click)="toggleDropdown()"
              class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
  
              <div class="h-9 w-9 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                {{ userInitials }}
              </div>
  
              <div class="hidden sm:flex flex-col items-start">
                <span class="text-sm font-semibold text-gray-900">
                  {{ authService.currentUser()?.nombre }}
                </span>
  
                <span class="text-xs text-gray-500">
                  Usuario Afiliado
                </span>
              </div>
  
              <span
                class="transition-transform"
                [class.rotate-180]="dropdownOpen()"
                >
                ⌄
              </span>
  
            </button>
  
  
            <!-- DROPDOWN -->
            @if (dropdownOpen()) {
              <div
                class="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg"
                >
                <div class="px-4 py-3 border-b">
                  <p class="font-semibold text-gray-900">
                    {{ authService.currentUser()?.nombre }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Usuario Afiliado
                  </p>
                </div>
                <div class="border-t"></div>
                <button
                  (click)="logout()"
                  class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                  >
                  Cerrar sesión
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </nav>
  `
})
export class NavbarComponent {

  notificationCount = signal(2)

  dropdownOpen = signal(false)

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleDropdown() {
    this.dropdownOpen.update(v => !v)
  }

  get userInitials(): string {
    const name = this.authService.currentUser()?.nombre || ''
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

}