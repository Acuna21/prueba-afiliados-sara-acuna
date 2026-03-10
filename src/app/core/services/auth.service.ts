import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/auth.model';

/**
 * Servicio para gestionar la autenticación de usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  
  currentUser = this.currentUserSignal.asReadonly();

  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor() {}

  /**
   * Valida las credenciales ingresadas por el usuario.
   * @param email correo electrónico ingresado
   * @param password contraseña ingresada
   * @returns objeto indicando si las credenciales son válidas
   */
  validateCredentials(email: string, password: string): { valid: boolean; user?: User } {
    const DEMO_EMAIL = 'afiliado@prueba.com';
    const DEMO_PASSWORD = 'Prueba2024*';

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return {
        valid: true,
        user: {
          email,
          nombre: 'Afiliado Prueba'
        }
      };
    }

    return { valid: false };
  }

  /**
 * Inicia sesión del usuario en el sistema.
 * Genera un token simulado y guarda la sesión en localStorage.
 *
 * @param user usuario autenticado
 */
  login(user: User): void {
    const userWithToken = { ...user, token: 'token_' + Date.now() };
    this.currentUserSignal.set(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
    localStorage.setItem('authToken', userWithToken.token);
  }

  /**
   * Cierra la sesión del usuario 
   * Limpia el estado de autenticación y elimina datos de localStorage.
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }

  private getUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}
