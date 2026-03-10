import { Injectable, signal } from '@angular/core';
import { CartaDerechos } from '../models/carta-derechos.model';
/**
 * Servicio encargado de gestionar las solicitudes de
 * Carta de Derechos dentro de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class CartaDerechosService {
  private cartasSignal = signal<CartaDerechos[]>(this.loadFromStorage());
  private counterSignal = signal<number>(this.loadCounterFromStorage());

  cartas = this.cartasSignal.asReadonly();
  counter = this.counterSignal.asReadonly();

  constructor() {}

  private loadFromStorage(): CartaDerechos[] {
    try {
      const data = localStorage.getItem('cartasDerechos');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private loadCounterFromStorage(): number {
    const counter = localStorage.getItem('cartasDerechosCounter');
    return counter ? parseInt(counter, 10) : 0;
  }

  private saveToStorage(): void {
    localStorage.setItem('cartasDerechos', JSON.stringify(this.cartasSignal()));
    localStorage.setItem('cartasDerechosCounter', this.counterSignal().toString());
  }

  private generateNumeroSolicitud(): string {
    const counter = this.counterSignal() + 1;
    this.counterSignal.set(counter);
    const year = new Date().getFullYear();
    const numero = String(counter).padStart(3, '0');
    return `SOL-${year}-${numero}`;
  }

  /**
   * Crea una nueva solicitud de Carta de Derechos.
   * @param carta Información de la carta sin id, número de solicitud ni fecha.
   * @returns Carta de derechos creada.
   */
  create(carta: Omit<CartaDerechos, 'id' | 'numeroSolicitud' | 'fechaSolicitud'>): CartaDerechos {
    const newCarta: CartaDerechos = {
      ...carta,
      id: this.cartasSignal().length ? Math.max(...this.cartasSignal().map(c => c.id || 0)) + 1 : 1,
      numeroSolicitud: this.generateNumeroSolicitud(),
      fechaSolicitud: new Date()
    };
    this.cartasSignal.update(cartas => [...cartas, newCarta]);
    this.saveToStorage();
    return newCarta;
  }

  getAll(): CartaDerechos[] {
    return this.cartasSignal();
  }

  getById(id: number): CartaDerechos | undefined {
    return this.cartasSignal().find(c => c.id === id);
  }

   /**
   * Actualiza la información de una carta de derechos.
   *
   * @param id Identificador de la carta a actualizar.
   * @param carta Datos parciales que se desean modificar.
   * @returns Carta actualizada o undefined si no se encuentra.
   */
  update(id: number, carta: Partial<CartaDerechos>): CartaDerechos | undefined {
    const index = this.cartasSignal().findIndex(c => c.id === id);
    if (index !== -1) {
      const updated = { ...this.cartasSignal()[index], ...carta, id };
      const updated$ = this.cartasSignal().map((c, i) => i === index ? updated : c);
      this.cartasSignal.set(updated$);
      this.saveToStorage();
      return updated;
    }
    return undefined;
  }

  /**
   * Elimina una carta de derechos por su ID.
   * @param id Identificador de la carta a eliminar.
   * @returns true si la eliminación fue exitosa, false si no se encontró.
   */
  delete(id: number): boolean {
    const index = this.cartasSignal().findIndex(c => c.id === id);
    if (index !== -1) {
      this.cartasSignal.update(cartas => cartas.filter(c => c.id !== id));
      this.saveToStorage();
      return true;
    }
    return false;
  }
}
